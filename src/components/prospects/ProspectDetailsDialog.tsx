import { format } from "date-fns";
import { CalendarIcon, PhoneIcon, MailIcon, MapPinIcon, BadgeIcon, InfoIcon, StarIcon, ClockIcon, TagIcon, UserPlus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Prospect, supabase } from "@/lib/supabase";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { prospectService } from "@/services/prospectService";
import { useToast } from '@/components/ui/use-toast';
import { useQueryClient } from '@tanstack/react-query';

type ProspectDetailsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prospect?: Prospect;
  onEdit: (prospect: Prospect) => void;
  onConvertSuccess: (prospectId: string) => void;
};

const ProspectDetailsDialog = ({
  open,
  onOpenChange,
  prospect,
  onEdit,
  onConvertSuccess,
}: ProspectDetailsDialogProps) => {
  const [isAlreadyClient, setIsAlreadyClient] = useState<boolean>(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isConverting, setIsConverting] = useState(false);
  
  useEffect(() => {
    // Check if the prospect is already a client when the dialog is opened and when the prospect changes
    if (open && prospect) {
      const checkClientStatus = async () => {
        try {
          const isClient = await prospectService.checkIfProspectIsClient(prospect.id);
          setIsAlreadyClient(isClient);
        } catch (error) {
          console.error(`Error checking client status for prospect ${prospect.id}:`, error);
          setIsAlreadyClient(false);
        }
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
  
  // Don't show convert button only for lost prospects or prospects that are already clients
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

  // Function to convert prospect to client
  const handleConvertToClient = async () => {
    try {
      setIsConverting(true);
      
      toast({
        title: "Starting conversion",
        description: "Converting prospect to client...",
      });
      
      console.log(`Attempting to convert prospect ${prospect.id} to client...`);
      
      // Call the actual conversion function from prospectService
      const result = await prospectService.convertToClient(prospect.id);
      
      if (result.success && result.client_id) {
        console.log(`Successfully converted prospect ${prospect.id} to client!`);
        
        // Force refresh data after successful conversion
        await queryClient.invalidateQueries({ queryKey: ['prospects'] });
        await queryClient.invalidateQueries({ queryKey: ['clients'] });
        
        toast({
          title: "Conversion completed",
          description: "Prospect successfully converted to client!",
        });
        
        // Close dialog
        onOpenChange(false);
        
        // Callback for success (redirect to clients page)
        if (onConvertSuccess) {
          onConvertSuccess(prospect.id);
        }
      } else if (result.already_exists && result.client_id) {
        console.log(`Prospect ${prospect.id} was already converted to client.`);
        
        toast({
          title: "Information",
          description: "This prospect has already been converted to a client.",
        });
        
        // Close dialog and redirect
        onOpenChange(false);
        if (onConvertSuccess) {
          onConvertSuccess(result.client_id);
        }
      } else {
        console.error(`Failed to convert prospect ${prospect.id} to client:`, result.message);
        
        toast({
          title: "Error",
          description: result.message || "Unable to convert prospect to client",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error converting prospect to client:', error);
      toast({
        title: "Conversion Error",
        description: "Failed to convert prospect to client. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConverting(false);
    }
  };

  return (
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
              onClick={handleConvertToClient}
              disabled={isConverting}
            >
              {isConverting ? (
                <>Converting...</>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Convert to Client
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProspectDetailsDialog; 