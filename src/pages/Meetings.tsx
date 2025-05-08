import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { calMeetingService } from '@/services/calMeetingService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { formatDistanceToNow, format, parseISO, differenceInMinutes, isToday, isTomorrow, isPast } from 'date-fns';
import { enUS, ptBR } from 'date-fns/locale';
import CalendarIframe from '@/components/meetings/CalendarIframe';
import { Button } from '@/components/ui/button';
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { motion } from "framer-motion";
import { 
  Clipboard, 
  ExternalLink, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  MessageSquare, 
  Check,
  AlertCircle,
  RefreshCw,
  X,
  Phone,
  Mail,
  ChevronRight,
  Info,
  Video,
  CalendarClock,
  Plus,
  Search
} from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { CalMeeting } from '@/lib/supabase';

// Helper function to format dates
const formatDate = (dateString: string) => {
  try {
    const date = parseISO(dateString);
    return format(date, "MMM dd, yyyy, h:mm a", { locale: enUS });
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

// Helper function to format just the date part
const formatDateOnly = (dateString: string) => {
  try {
    const date = parseISO(dateString);
    if (isToday(date)) {
      return "Today";
    } else if (isTomorrow(date)) {
      return "Tomorrow";
    }
    return format(date, "EEEE, MMMM d, yyyy", { locale: enUS });
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

// Helper function to format day and month
const formatDayMonth = (dateString: string) => {
  try {
    const date = parseISO(dateString);
    if (isToday(date)) {
      return "Today";
    } else if (isTomorrow(date)) {
      return "Tomorrow";
    }
    return format(date, "MMM d", { locale: enUS });
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

// Helper function to get day of month
const getDayOfMonth = (dateString: string) => {
  try {
    const date = parseISO(dateString);
    return format(date, "d", { locale: enUS });
  } catch (error) {
    console.error('Error getting day of month:', error);
    return "";
  }
};

// Helper function to get month abbreviation
const getMonthAbbr = (dateString: string) => {
  try {
    const date = parseISO(dateString);
    return format(date, "MMM", { locale: enUS });
  } catch (error) {
    console.error('Error getting month abbreviation:', error);
    return "";
  }
};

// Helper function to format just the time part
const formatTimeOnly = (dateString: string) => {
  try {
    const date = parseISO(dateString);
    return format(date, "h:mm a", { locale: enUS });
  } catch (error) {
    console.error('Error formatting time:', error);
    return dateString;
  }
};

// Helper function to get meeting duration
const getMeetingDuration = (startTime: string, endTime: string) => {
  try {
    const start = parseISO(startTime);
    const end = parseISO(endTime);
    const minutes = differenceInMinutes(end, start);
    
    if (minutes < 60) {
      return `${minutes} minutes`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return remainingMinutes > 0 
        ? `${hours} hour${hours > 1 ? 's' : ''} ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''}` 
        : `${hours} hour${hours > 1 ? 's' : ''}`;
    }
  } catch (error) {
    console.error('Error calculating duration:', error);
    return '';
  }
};

// Helper function to get relative time
const getRelativeTime = (dateString: string) => {
  try {
    const date = parseISO(dateString);
    return formatDistanceToNow(date, { addSuffix: true, locale: enUS });
  } catch (error) {
    console.error('Error getting relative time:', error);
    return '';
  }
};

// Get initials from name
const getInitials = (name: string) => {
  if (!name) return '??';
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

// Get status badge color and properties
const getStatusBadge = (status: string) => {
  switch (status?.toLowerCase() || 'pending') {
    case 'accepted':
    case 'confirmed':
      return { 
        color: "bg-emerald-50 text-emerald-700 border-emerald-200", 
        hoverColor: "hover:bg-emerald-100",
        icon: <Check className="h-3.5 w-3.5 mr-1.5" />,
        label: "Confirmed"
      };
    case 'rescheduled':
      return { 
        color: "bg-amber-50 text-amber-700 border-amber-200",
        hoverColor: "hover:bg-amber-100",
        icon: <RefreshCw className="h-3.5 w-3.5 mr-1.5" />,
        label: "Rescheduled"
      };
    case 'cancelled':
    case 'canceled':
      return { 
        color: "bg-rose-50 text-rose-700 border-rose-200",
        hoverColor: "hover:bg-rose-100",
        icon: <X className="h-3.5 w-3.5 mr-1.5" />,
        label: "Cancelled"
      };
    case 'pending':
      return { 
        color: "bg-blue-50 text-blue-700 border-blue-200",
        hoverColor: "hover:bg-blue-100",
        icon: <AlertCircle className="h-3.5 w-3.5 mr-1.5" />,
        label: "Pending"
      };
    default:
      return { 
        color: "bg-gray-50 text-gray-700 border-gray-200",
        hoverColor: "hover:bg-gray-100",
        icon: <Info className="h-3.5 w-3.5 mr-1.5" />,
        label: status || "Unknown"
      };
  }
};

// Get trigger event badge properties
const getTriggerBadge = (triggerEvent: string) => {
  switch (triggerEvent.toLowerCase()) {
    case 'booking_created':
      return {
        color: "bg-indigo-50 text-indigo-700 border-indigo-200",
        icon: <Calendar className="h-3.5 w-3.5 mr-1.5" />,
        label: "New Booking"
      };
    case 'booking_rescheduled':
      return {
        color: "bg-amber-50 text-amber-700 border-amber-200",
        icon: <CalendarClock className="h-3.5 w-3.5 mr-1.5" />,
        label: "Rescheduled"
      };
    case 'booking_cancelled':
    case 'booking_canceled':
      return {
        color: "bg-rose-50 text-rose-700 border-rose-200",
        icon: <X className="h-3.5 w-3.5 mr-1.5" />,
        label: "Cancelled"
      };
    default:
      return {
        color: "bg-gray-50 text-gray-700 border-gray-200",
        icon: <Info className="h-3.5 w-3.5 mr-1.5" />,
        label: triggerEvent.replace(/_/g, ' ')
      };
  }
};

// Generate random pastel color for avatars based on name
const getAvatarColor = (name: string) => {
  const colors = [
    'bg-rose-100 text-rose-800',
    'bg-pink-100 text-pink-800',
    'bg-fuchsia-100 text-fuchsia-800',
    'bg-purple-100 text-purple-800',
    'bg-violet-100 text-violet-800',
    'bg-indigo-100 text-indigo-800',
    'bg-blue-100 text-blue-800',
    'bg-sky-100 text-sky-800',
    'bg-cyan-100 text-cyan-800',
    'bg-teal-100 text-teal-800',
    'bg-emerald-100 text-emerald-800',
    'bg-green-100 text-green-800',
    'bg-lime-100 text-lime-800',
    'bg-yellow-100 text-yellow-800',
    'bg-amber-100 text-amber-800',
    'bg-orange-100 text-orange-800',
  ];
  
  // Simple hash function for name
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Ensure positive index
  hash = Math.abs(hash);
  return colors[hash % colors.length];
};

interface MeetingDetailsProps {
  meeting: any;
  onClose: () => void;
}

const MeetingDetails = ({ meeting, onClose }: MeetingDetailsProps) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const statusInfo = getStatusBadge(meeting.status);
  const triggerInfo = getTriggerBadge(meeting.trigger_event);
  const hasValidPhone = meeting.phone_number && meeting.phone_number !== "integrations:google:meet";
  const shouldShowMeetLink = meeting.meeting_link;

  return (
    <DialogContent className="max-w-4xl">
      <DialogHeader className="pb-4 border-b">
        <div className="flex items-center justify-between">
          <DialogTitle className="text-2xl font-bold">{meeting.title}</DialogTitle>
          <Badge 
            variant="outline" 
            className={`ml-2 ${statusInfo.color} border flex items-center py-1 px-2`}
          >
            {statusInfo.icon}
            {statusInfo.label}
          </Badge>
        </div>
        <DialogDescription className="flex items-center flex-wrap gap-2 mt-2">
          <Badge variant="outline" className={`${triggerInfo.color} border flex items-center py-0.5`}>
            {triggerInfo.icon}
            {triggerInfo.label}
          </Badge>
          {meeting.ical_uid && (
            <span className="text-xs text-muted-foreground font-mono">ID: {meeting.ical_uid}</span>
          )}
        </DialogDescription>
      </DialogHeader>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 py-6">
        <div className="space-y-6">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 p-2 bg-blue-50 text-blue-700 rounded-full">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-medium text-base mb-1">Date & Time</h4>
              <p className="text-base font-medium">{formatDateOnly(meeting.start_time)}</p>
              <p className="text-base mt-1">
                {formatTimeOnly(meeting.start_time)} - {formatTimeOnly(meeting.end_time)}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {getMeetingDuration(meeting.start_time, meeting.end_time)}
              </p>
            </div>
          </div>
          
          {meeting.attendee_name && (
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 p-2 bg-violet-50 text-violet-700 rounded-full">
                <User className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-medium text-base mb-1">Attendee</h4>
                <div className="flex items-center">
                  <Avatar className="h-6 w-6 mr-2">
                    <AvatarFallback className={`text-xs ${getAvatarColor(meeting.attendee_name)}`}>
                      {getInitials(meeting.attendee_name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{meeting.attendee_name}</span>
                </div>
                
                <div className="mt-2 space-y-2">
                  {meeting.attendee_email && (
                    <div className="flex items-center text-sm">
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                      <a 
                        href={`mailto:${meeting.attendee_email}`} 
                        className="text-blue-600 hover:underline break-all"
                      >
                        {meeting.attendee_email}
                      </a>
                    </div>
                  )}
                  
                  {hasValidPhone && (
                    <div className="flex items-center text-sm">
                      <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                      <a 
                        href={`tel:${meeting.phone_number}`} 
                        className="text-blue-600 hover:underline"
                      >
                        {meeting.phone_number}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {shouldShowMeetLink && (
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 p-2 bg-emerald-50 text-emerald-700 rounded-full">
                <Video className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-medium text-base mb-1">Meeting Link</h4>
                <p className="text-sm break-all">
                  <a 
                    href={meeting.meeting_link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-600 hover:underline inline-flex items-center"
                  >
                    {meeting.meeting_link}
                    <ExternalLink className="h-3.5 w-3.5 ml-1 inline-flex" />
                  </a>
                </p>
                
                <div className="mt-3 flex space-x-2">
                  <Button 
                    size="sm"
                    variant="outline" 
                    onClick={() => copyToClipboard(meeting.meeting_link)}
                    className="h-8"
                  >
                    <Clipboard className="h-3.5 w-3.5 mr-1.5" />
                    {copied ? 'Copied!' : 'Copy Link'}
                  </Button>
                  
                  <Button 
                    size="sm"
                    onClick={() => window.open(meeting.meeting_link, '_blank')}
                    className="h-8 bg-emerald-600 hover:bg-emerald-700"
                  >
                    <Video className="h-3.5 w-3.5 mr-1.5" />
                    Join Meeting
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="space-y-6">
          {(meeting.reschedule_reason || meeting.cancellation_reason) && (
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 p-2 bg-amber-50 text-amber-700 rounded-full">
                <AlertCircle className="h-5 w-5" />
              </div>
              <div>
                {meeting.reschedule_reason && (
                  <>
                    <h4 className="font-medium text-base mb-1">Rescheduling Reason</h4>
                    <p className="text-base">{meeting.reschedule_reason}</p>
                  </>
                )}
                {meeting.cancellation_reason && (
                  <>
                    <h4 className="font-medium text-base mb-1 mt-3">Cancellation Reason</h4>
                    <p className="text-base">{meeting.cancellation_reason}</p>
                  </>
                )}
              </div>
            </div>
          )}
          
          {(meeting.description || meeting.additional_notes) && (
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 p-2 bg-indigo-50 text-indigo-700 rounded-full">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div className="flex-1">
                {meeting.description && (
                  <>
                    <h4 className="font-medium text-base mb-1">Description</h4>
                    <div className="p-3 bg-gray-50 rounded-md text-gray-800 whitespace-pre-line text-sm">
                      {meeting.description}
                    </div>
                  </>
                )}
                
                {meeting.additional_notes && (
                  <div className="mt-4">
                    <h4 className="font-medium text-base mb-1">Additional Notes</h4>
                    <div className="p-3 bg-blue-50 rounded-md text-gray-800 whitespace-pre-line text-sm border border-blue-100">
                      {meeting.additional_notes}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 p-2 bg-gray-100 text-gray-700 rounded-full">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-medium text-base mb-1">Created</h4>
              <p className="text-sm text-muted-foreground">{formatDate(meeting.created_at)}</p>
              {meeting.updated_at && meeting.updated_at !== meeting.created_at && (
                <p className="text-sm text-muted-foreground mt-1">
                  Updated: {formatDate(meeting.updated_at)}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <DialogFooter className="flex flex-row justify-end border-t pt-4">
        {shouldShowMeetLink && (
          <Button 
            onClick={() => window.open(meeting.meeting_link, '_blank')}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <Video className="h-4 w-4 mr-2" />
            Join Meeting
          </Button>
        )}
      </DialogFooter>
    </DialogContent>
  );
};

const MeetingCard = ({ meeting }: { meeting: any }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const statusInfo = getStatusBadge(meeting.status);
  const hasValidPhone = meeting.phone_number && meeting.phone_number !== "integrations:google:meet";
  const shouldShowMeetLink = meeting.meeting_link;
  
  return (
    <>
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <Card 
          className="relative overflow-hidden transition-all duration-200 hover:shadow-lg cursor-pointer group border border-gray-200 h-full"
          onClick={() => setShowDetails(true)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className={`absolute top-0 left-0 w-1 h-full ${statusInfo.color.replace("bg-", "bg-")}`} />
          
          <div className="absolute top-0 right-0 w-2 h-2 mt-1 mr-1 rounded-full transition-all duration-300"
            style={{ backgroundColor: isHovered ? '#6366f1' : 'transparent' }}
          />
          
          <div className="flex flex-col h-full">
            <CardHeader className="p-4 pb-2 flex-shrink-0">
              <div className="flex justify-between items-start gap-2">
                <div>
                  <div className="flex-shrink-0 mb-1">
                    <Badge 
                      variant="outline" 
                      className={`${statusInfo.color} border px-2 py-0 h-5 text-xs flex items-center font-medium`}
                    >
                      {statusInfo.icon}
                      {statusInfo.label}
                    </Badge>
                  </div>
                  <CardTitle className="text-base font-medium group-hover:text-primary transition-colors line-clamp-2">
                    {meeting.title}
                  </CardTitle>
                </div>
                <div className="flex-shrink-0 flex flex-col items-center justify-center p-2 w-12 h-12 bg-gray-50 rounded-md text-center border border-gray-100 group-hover:border-primary transition-colors">
                  <span className="text-lg font-bold leading-none text-gray-800">{getDayOfMonth(meeting.start_time)}</span>
                  <span className="text-xs uppercase text-gray-500 mt-1">{getMonthAbbr(meeting.start_time)}</span>
                </div>
              </div>
              
              <div className="mt-2">
                <CardDescription className="flex items-center space-x-1">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {formatTimeOnly(meeting.start_time)} - {formatTimeOnly(meeting.end_time)}
                  </span>
                </CardDescription>
              </div>
            </CardHeader>
            
            <CardContent className="p-4 pt-2 flex-grow">
              {meeting.attendee_name && (
                <div className="flex items-center gap-2 mb-3">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className={`text-xs ${getAvatarColor(meeting.attendee_name)}`}>
                      {getInitials(meeting.attendee_name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium line-clamp-1">{meeting.attendee_name}</span>
                </div>
              )}
              
              {/* Phone number - Prominently displayed when available */}
              {hasValidPhone && (
                <div className="flex items-center gap-2 mb-3 p-2 bg-amber-50 border border-amber-200 rounded-md">
                  <Phone className="h-4 w-4 text-amber-700" />
                  <div className="flex flex-col">
                    <span className="text-xs text-amber-800 font-semibold">Call this number:</span>
                    <a 
                      href={`tel:${meeting.phone_number}`} 
                      className="text-sm text-blue-600 hover:underline font-medium"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {meeting.phone_number}
                    </a>
                  </div>
                </div>
              )}
              
              {meeting.description && (
                <p className="text-xs text-gray-600 line-clamp-2 mb-2">{meeting.description}</p>
              )}
              
              {meeting.additional_notes && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center text-xs text-blue-600 mt-1.5">
                        <Info className="h-3 w-3 mr-1" />
                        <span>Additional notes available</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs text-xs">{meeting.additional_notes}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              
              {meeting.cancellation_reason && (
                <div className="flex items-center text-xs text-rose-600 mt-1.5">
                  <X className="h-3 w-3 mr-1" />
                  <span className="line-clamp-1">Cancelled: {meeting.cancellation_reason}</span>
                </div>
              )}
            </CardContent>
            
            <CardFooter className="p-4 pt-0 mt-auto flex items-center justify-between border-t flex-shrink-0">
              <div className="text-xs text-gray-500">{getRelativeTime(meeting.start_time)}</div>
              
              {shouldShowMeetLink && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="ml-auto text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 p-0 h-auto px-2 py-1"
                  onClick={(e) => {
                    e.stopPropagation(); 
                    window.open(meeting.meeting_link, '_blank');
                  }}
                >
                  <Video className="h-3.5 w-3.5 mr-1" />
                  <span className="text-xs">Join</span>
                </Button>
              )}
            </CardFooter>
          </div>
          
          <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <ChevronRight className="h-4 w-4 text-primary" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">View details</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </Card>
      </motion.div>
      
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <MeetingDetails meeting={meeting} onClose={() => setShowDetails(false)} />
      </Dialog>
    </>
  );
};

const EmptyState = ({ title, description, action }: { title: string; description: string; action?: React.ReactNode }) => (
  <div className="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed border-gray-200 rounded-lg">
    <div className="bg-gray-50 p-3 rounded-full">
      <Calendar className="h-8 w-8 text-gray-400" />
    </div>
    <h3 className="mt-4 text-lg font-medium text-gray-900">{title}</h3>
    <p className="mt-1 text-sm text-gray-500 text-center max-w-sm">{description}</p>
    {action && <div className="mt-4">{action}</div>}
  </div>
);

const Meetings = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("upcoming");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["meetings"],
    queryFn: calMeetingService.getMeetings,
  });

  // Converter data para array de CalMeeting
  const meetings = (data || []) as CalMeeting[];

  // Filtrar reuniões baseado no termo de pesquisa
  const filterMeetings = (meetings: CalMeeting[]) => {
    if (!searchTerm.trim()) return meetings;
    
    const searchLower = searchTerm.toLowerCase();
    return meetings.filter(meeting => {
      return (
        meeting.title.toLowerCase().includes(searchLower) ||
        (meeting.description && meeting.description.toLowerCase().includes(searchLower)) ||
        (meeting.attendee_name && meeting.attendee_name.toLowerCase().includes(searchLower)) ||
        (meeting.attendee_email && meeting.attendee_email.toLowerCase().includes(searchLower))
      );
    });
  };

  const filteredMeetings = filterMeetings(meetings);
  const upcomingMeetings = filteredMeetings.filter((meeting) => !isPast(new Date(meeting.end_time)));
  const pastMeetings = filteredMeetings.filter((meeting) => isPast(new Date(meeting.end_time)));

  return (
    <AppLayout>
      <div className="container py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Meetings</h1>
          <div className="flex gap-2 items-center">
            {/* Barra de pesquisa */}
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500"/>
              <Input
                placeholder="Search meetings..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Dialog open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule Meeting
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Schedule a Meeting</DialogTitle>
                </DialogHeader>
                <CalendarIframe onClose={() => setIsCalendarOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="upcoming">
              Upcoming ({upcomingMeetings.length})
            </TabsTrigger>
            <TabsTrigger value="past">
              Past ({pastMeetings.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="mt-6">
            {isLoading ? (
              <div className="my-8 text-center">Loading meetings...</div>
            ) : error ? (
              <div className="my-8 text-center text-red-500">
                Error loading meetings. Please try again.
              </div>
            ) : upcomingMeetings.length === 0 && searchTerm ? (
              <EmptyState
                title="No meetings found"
                description={`No upcoming meetings matching "${searchTerm}"`}
              />
            ) : upcomingMeetings.length === 0 ? (
              <EmptyState
                title="No upcoming meetings"
                description="Schedule a meeting to get started"
                action={
                  <Button onClick={() => setIsCalendarOpen(true)}>
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Meeting
                  </Button>
                }
              />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {upcomingMeetings.map((meeting) => (
                  <MeetingCard key={meeting.id} meeting={meeting} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="past" className="mt-6">
            {isLoading ? (
              <div className="my-8 text-center">Loading meetings...</div>
            ) : error ? (
              <div className="my-8 text-center text-red-500">
                Error loading meetings. Please try again.
              </div>
            ) : pastMeetings.length === 0 && searchTerm ? (
              <EmptyState
                title="No meetings found"
                description={`No past meetings matching "${searchTerm}"`}
              />
            ) : pastMeetings.length === 0 ? (
              <EmptyState
                title="No past meetings"
                description="Past meetings will appear here"
              />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {pastMeetings.map((meeting) => (
                  <MeetingCard key={meeting.id} meeting={meeting} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Meetings;
