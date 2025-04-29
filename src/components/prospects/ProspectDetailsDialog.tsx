import { format } from "date-fns";
import { CalendarIcon, PhoneIcon, MailIcon, MapPinIcon, BadgeIcon, InfoIcon, StarIcon, ClockIcon, TagIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Prospect } from "@/lib/supabase";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { prospectService } from "@/services/prospectService";
import ScheduleMeetingDialog from "@/components/calendar/ScheduleMeetingDialog";

type ProspectDetailsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prospect?: Prospect;
  onEdit: (prospect: Prospect) => void;
  onConvertToClient: (prospect: Prospect) => void;
};

const ProspectDetailsDialog = ({
  open,
  onOpenChange,
  prospect,
  onEdit,
  onConvertToClient,
}: ProspectDetailsDialogProps) => {
  const [isAlreadyClient, setIsAlreadyClient] = useState<boolean>(false);
  const [scheduleMeetingOpen, setScheduleMeetingOpen] = useState(false);
  
  useEffect(() => {
    // Verificar se o prospect já é um cliente quando o diálogo é aberto e quando o prospect muda
    if (open && prospect) {
      const checkClientStatus = async () => {
        const isClient = await prospectService.checkIfProspectIsClient(prospect.id);
        setIsAlreadyClient(isClient);
      };
      
      checkClientStatus();
    }
  }, [open, prospect]);

  if (!prospect) return null;

  // Format dates for display
  const formattedFirstContact = prospect.first_contact_at
    ? format(new Date(prospect.first_contact_at), "MMM dd, yyyy")
    : "N/A";
  
  const formattedFollowUp = prospect.next_follow_up_at
    ? format(new Date(prospect.next_follow_up_at), "MMM dd, yyyy")
    : "None scheduled";
  
  const formattedCreatedAt = prospect.created_at
    ? format(new Date(prospect.created_at), "MMM dd, yyyy")
    : "N/A";
  
  // Don't show convert button for lost prospects or prospects that are already clients
  const showConvertButton = prospect.status !== 'lost' && !isAlreadyClient;

  // Status colors
  const statusColors = {
    new: "bg-blue-100 text-blue-800",
    interested: "bg-green-100 text-green-800",
    negotiation: "bg-purple-100 text-purple-800",
    lost: "bg-gray-100 text-gray-800"
  };

  // Score to stars
  const scoreToStars = (score: number) => {
    return (
      <div className="flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <StarIcon 
            key={i} 
            className={`h-4 w-4 ${i < score ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
          />
        ))}
      </div>
    );
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center justify-between">
              <span>{prospect.contact_name}</span>
              <Badge className={statusColors[prospect.status]}>
                {prospect.status.charAt(0).toUpperCase() + prospect.status.slice(1)}
              </Badge>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Company Info */}
            <div>
              <h3 className="text-md font-medium mb-2">Company Information</h3>
              <Card>
                <CardContent className="p-4 space-y-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <BadgeIcon className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-500">Company:</span>
                      <span className="font-medium">{prospect.company_name || "N/A"}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <TagIcon className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-500">Business Type:</span>
                      <span className="font-medium">{prospect.business_type || "N/A"}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Contact Info */}
            <div>
              <h3 className="text-md font-medium mb-2">Contact Information</h3>
              <Card>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center space-x-2">
                    <PhoneIcon className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-500">Phone:</span>
                    <span className="font-medium">{prospect.phone}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <MailIcon className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-500">Email:</span>
                    <span className="font-medium">{prospect.email || "N/A"}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <MapPinIcon className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-500">Location:</span>
                    <span className="font-medium">
                      {prospect.region_city && prospect.region_state 
                        ? `${prospect.region_city}, ${prospect.region_state}` 
                        : prospect.region_city || prospect.region_state || "N/A"}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <ClockIcon className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-500">Timezone:</span>
                    <span className="font-medium">{prospect.timezone || "N/A"}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Lead Details */}
            <div>
              <h3 className="text-md font-medium mb-2">Lead Details</h3>
              <Card>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center space-x-2">
                    <InfoIcon className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-500">Source:</span>
                    <span className="font-medium">{prospect.lead_source || "N/A"}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Priority Score:</span>
                    <span className="font-medium">{scoreToStars(prospect.score)}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <CalendarIcon className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-500">First Contact:</span>
                    <span className="font-medium">{formattedFirstContact}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <CalendarIcon className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-500">Next Follow-up:</span>
                    <span className="font-medium">{formattedFollowUp}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Notes & Summary */}
            <div>
              <h3 className="text-md font-medium mb-2">Notes & Summary</h3>
              <Card>
                <CardContent className="p-4 space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-1">Call Summary</h4>
                    <p className="text-sm">{prospect.call_summary || "No call summary recorded."}</p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="text-sm font-medium mb-1">Notes</h4>
                    <p className="text-sm">{prospect.notes || "No additional notes."}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* System Info */}
            <div>
              <h3 className="text-md font-medium mb-2">System Information</h3>
              <Card>
                <CardContent className="p-4">
                  <div className="text-xs text-gray-500">
                    Created: {formattedCreatedAt}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <DialogFooter className="mt-6 space-x-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
            
            <Button
              variant="outline"
              onClick={() => setScheduleMeetingOpen(true)}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              Schedule Meeting
            </Button>
            
            <Button
              variant="secondary"
              onClick={() => {
                onEdit(prospect);
                onOpenChange(false);
              }}
            >
              Edit Prospect
            </Button>
            
            {showConvertButton && (
              <Button
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={() => {
                  onConvertToClient(prospect);
                  onOpenChange(false);
                }}
              >
                Convert to Client
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <ScheduleMeetingDialog
        open={scheduleMeetingOpen}
        onOpenChange={setScheduleMeetingOpen}
        prospectId={prospect.id}
        attendeeName={prospect.contact_name}
        attendeeEmail={prospect.email || ''}
        attendeeTimezone={prospect.timezone || 'America/New_York'}
      />
    </>
  );
};

export default ProspectDetailsDialog; 