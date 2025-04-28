
import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const dummyMeetings = [
  {
    id: 1,
    title: "Website Progress Review",
    client: "ABC Corporation",
    type: "Client",
    startDate: "2025-04-28T15:00:00",
    endDate: "2025-04-28T16:00:00",
    meetLink: "https://meet.google.com/abc-defg-hij",
    notes: "Review website development progress and gather feedback",
  },
  {
    id: 2,
    title: "Initial Discovery Call",
    client: "Potential Lead LLC",
    type: "Prospect",
    startDate: "2025-04-29T10:00:00",
    endDate: "2025-04-29T11:00:00",
    meetLink: "https://meet.google.com/klm-nopq-rst",
    notes: "Discuss marketing needs and potential services",
  },
  {
    id: 3,
    title: "Marketing Strategy Session",
    client: "XYZ Inc",
    type: "Client",
    startDate: "2025-04-30T14:00:00",
    endDate: "2025-04-30T15:30:00",
    meetLink: "https://meet.google.com/uvw-xyz-123",
    notes: "Quarterly marketing strategy planning",
  },
  {
    id: 4,
    title: "Proposal Presentation",
    client: "Future Client Co",
    type: "Prospect",
    startDate: "2025-05-02T11:00:00",
    endDate: "2025-05-02T12:00:00",
    meetLink: "https://meet.google.com/456-789-abc",
    notes: "Present service proposal and pricing",
  },
];

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(date);
};

const formatTimeOnly = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(date);
};

const MeetingCard = ({ meeting }: { meeting: any }) => {
  const startDate = new Date(meeting.startDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const startDateDay = new Date(startDate);
  startDateDay.setHours(0, 0, 0, 0);
  
  let dateLabel = formatDate(meeting.startDate);
  
  if (startDateDay.getTime() === today.getTime()) {
    dateLabel = `Today, ${formatTimeOnly(meeting.startDate)}`;
  } else if (startDateDay.getTime() === tomorrow.getTime()) {
    dateLabel = `Tomorrow, ${formatTimeOnly(meeting.startDate)}`;
  }
  
  return (
    <Card className="mb-4 shadow-neumorph-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-bold">{meeting.title}</CardTitle>
            <p className="text-sm text-gray-500">{meeting.client}</p>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full ${meeting.type === 'Client' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
            {meeting.type}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center">
            <span className="text-gray-500 mr-2">📅</span>
            <span>{dateLabel}</span>
          </div>
          <div className="flex items-center">
            <span className="text-gray-500 mr-2">⏱️</span>
            <span>{formatTimeOnly(meeting.startDate)} - {formatTimeOnly(meeting.endDate)}</span>
          </div>
          {meeting.notes && (
            <div className="text-sm text-gray-500">
              <p className="font-medium">Notes:</p>
              <p>{meeting.notes}</p>
            </div>
          )}
          <div className="flex space-x-2 mt-4">
            <Button variant="default" size="sm" className="flex-1">
              Join Meeting
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              Copy Link
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Meetings = () => {
  const today = new Date();
  const upcomingMeetings = dummyMeetings.filter(
    (meeting) => new Date(meeting.startDate) >= today
  ).sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  
  const pastMeetings = dummyMeetings.filter(
    (meeting) => new Date(meeting.startDate) < today
  ).sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
  
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Meetings</h1>
            <p className="text-gray-500">Schedule and manage your client meetings.</p>
          </div>
          <Button variant="default" className="bg-secondary hover:bg-secondary/90">
            + Schedule Meeting
          </Button>
        </div>
        
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="upcoming">Upcoming ({upcomingMeetings.length})</TabsTrigger>
            <TabsTrigger value="past">Past Meetings ({pastMeetings.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcomingMeetings.map((meeting) => (
                <MeetingCard key={meeting.id} meeting={meeting} />
              ))}
              {upcomingMeetings.length === 0 && (
                <div className="col-span-2 text-center py-10 text-gray-500">
                  No upcoming meetings scheduled.
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="past">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pastMeetings.map((meeting) => (
                <MeetingCard key={meeting.id} meeting={meeting} />
              ))}
              {pastMeetings.length === 0 && (
                <div className="col-span-2 text-center py-10 text-gray-500">
                  No past meetings found.
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Meetings;
