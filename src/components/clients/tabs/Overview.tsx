import { useState } from "react";
import { Client } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import { Edit, BadgeIcon, InfoIcon, PhoneIcon, MailIcon, MapPinIcon, Globe, TagIcon, StarIcon, CreditCard, DollarSign, Clock, Calendar } from "lucide-react";
import CalendarIframe from "@/components/meetings/CalendarIframe";

interface OverviewProps {
  client: Client;
  onEdit: () => void;
}

export default function Overview({ client, onEdit }: OverviewProps) {
  const [calendarOpen, setCalendarOpen] = useState(false);
  
  return (
    <div className="space-y-4 mt-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Client Overview</h3>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setCalendarOpen(true)}>
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Meeting
          </Button>
          <Button onClick={onEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Client
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-md">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-2">
              <BadgeIcon className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium">Contact Name</p>
                <p>{client.contact_name}</p>
              </div>
            </div>
            
            {client.company_name && (
              <div className="flex items-start gap-2">
                <InfoIcon className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Company</p>
                  <p>{client.company_name}</p>
                </div>
              </div>
            )}
            
            <div className="flex items-start gap-2">
              <PhoneIcon className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium">Phone</p>
                <p>{client.phone}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <MailIcon className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium">Email</p>
                <p>{client.email}</p>
              </div>
            </div>
            
            {client.full_address && (
              <div className="flex items-start gap-2">
                <MapPinIcon className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Address</p>
                  <p>{client.full_address}</p>
                </div>
              </div>
            )}

            {client.website && (
              <div className="flex items-start gap-2">
                <Globe className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Website</p>
                  <a 
                    href={client.website.startsWith('http') ? client.website : `https://${client.website}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {client.website}
                  </a>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-md">Plan Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-2">
              <TagIcon className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium">Business Type</p>
                <p>{client.business_type}</p>
              </div>
            </div>
            
            {client.score && (
              <div className="flex items-start gap-2">
                <StarIcon className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Score</p>
                  <div className="flex">
                    {Array(5).fill(0).map((_, i) => (
                      <StarIcon 
                        key={i} 
                        className={`h-4 w-4 ${i < client.score ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {client.plan_name && (
              <div className="flex items-start gap-2">
                <CreditCard className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Plan</p>
                  <p>{client.plan_name}</p>
                </div>
              </div>
            )}
            
            {client.monthly_fee !== undefined && client.monthly_fee !== null && (
              <div className="flex items-start gap-2">
                <DollarSign className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Monthly Value</p>
                  <p className="font-semibold">
                    {new Intl.NumberFormat('en-US', { 
                      style: 'currency', 
                      currency: 'USD' 
                    }).format(client.monthly_fee)}
                  </p>
                </div>
              </div>
            )}
            
            {client.ad_budget !== undefined && client.ad_budget !== null && (
              <div className="flex items-start gap-2">
                <DollarSign className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Ad Budget</p>
                  <p className="font-semibold">
                    {new Intl.NumberFormat('en-US', { 
                      style: 'currency', 
                      currency: 'USD' 
                    }).format(client.ad_budget)}
                  </p>
                </div>
              </div>
            )}
            
            <div className="flex items-start gap-2">
              <Clock className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium">Client since</p>
                <p>
                  {format(new Date(client.created_at), "MMMM d, yyyy", { locale: enUS })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Cal.com Calendar Iframe */}
      <CalendarIframe
        open={calendarOpen}
        onOpenChange={setCalendarOpen}
      />
    </div>
  );
} 