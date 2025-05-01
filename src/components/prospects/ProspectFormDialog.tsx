import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Prospect } from "@/lib/supabase";
import { ProspectFormData } from "@/services/prospectService";
import { useAuth } from "@/contexts/AuthContext";

const formSchema = z.object({
  contact_name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  company_name: z.string().nullable().optional(),
  phone: z.string().min(5, { message: "Phone number is required" }),
  email: z.string().email({ message: "Invalid email address" }).optional(),
  lead_source: z.string().default("Other"),
  business_type: z.string().optional(),
  region_city: z.string().optional(),
  region_state: z.string().optional(),
  timezone: z.string().default("America/Chicago").optional(),
  score: z.coerce.number().min(1).max(5).default(3).optional(),
  status: z.enum(["new", "interested", "negotiation", "lost"]).default("new").optional(),
  first_contact_at: z.date().default(() => new Date()).optional(),
  call_summary: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  next_follow_up_at: z.date().nullable().optional(),
});

type FormValues = z.infer<typeof formSchema>;

type ProspectFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ProspectFormData) => Promise<void>;
  initialData?: Prospect;
  mode?: "create" | "edit";
};

const ProspectFormDialog = ({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  mode = "create",
}: ProspectFormDialogProps) => {
  const { user } = useAuth();
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(!!initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          first_contact_at: initialData.first_contact_at
            ? new Date(initialData.first_contact_at)
            : new Date(),
          next_follow_up_at: initialData.next_follow_up_at
            ? new Date(initialData.next_follow_up_at)
            : undefined,
        }
      : {
          status: "new",
          score: 3,
          first_contact_at: new Date(),
          timezone: "America/Chicago",
          lead_source: "Other",
          business_type: "Other",
        },
  });

  // Reset form when initialData changes or when modal opens
  useEffect(() => {
    if (open) {
      if (initialData) {
        // Reset form with initialData for edit mode
        form.reset({
          ...initialData,
          first_contact_at: initialData.first_contact_at
            ? new Date(initialData.first_contact_at)
            : new Date(),
          next_follow_up_at: initialData.next_follow_up_at
            ? new Date(initialData.next_follow_up_at)
            : undefined,
        });
        // Automatically open advanced section for existing prospects
        setIsAdvancedOpen(true);
      } else {
        // Reset form with defaults for create mode
        form.reset({
          status: "new",
          score: 3,
          first_contact_at: new Date(),
          timezone: "America/Chicago",
          lead_source: "Other",
          business_type: "Other",
        });
        setIsAdvancedOpen(false);
      }
    }
  }, [form, initialData, open]);

  const handleSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);
      
      // Ensure required fields are present for ProspectFormData
      const formattedData: ProspectFormData = {
        contact_name: values.contact_name,
        company_name: values.company_name || null,
        phone: values.phone,
        email: values.email || null,
        lead_source: values.lead_source || "Other",
        business_type: values.business_type || "Other",
        region_city: values.region_city || null,
        region_state: values.region_state || null,
        timezone: values.timezone || "America/Chicago",
        score: values.score || 3,
        status: values.status || "new",
        first_contact_at: values.first_contact_at?.toISOString() || new Date().toISOString(),
        call_summary: values.call_summary || null,
        notes: values.notes || null,
        next_follow_up_at: values.next_follow_up_at?.toISOString() || null,
        owner_id: initialData?.owner_id || user?.id || "",
      };
      
      await onSubmit(formattedData);
      onOpenChange(false);
    } catch (error) {
      console.error("Error submitting prospect form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add New Prospect" : "Edit Prospect"}
          </DialogTitle>
          <DialogDescription>
            Fill in the prospect information below
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="flex-1 overflow-auto pr-4 max-h-[calc(80vh-10rem)]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="contact_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="company_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input placeholder="ABC Corporation" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="email@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="(555) 123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="lead_source"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lead Source</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ""}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a source" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Ads">Ads</SelectItem>
                          <SelectItem value="Cold-call">Cold-call</SelectItem>
                          <SelectItem value="Referral">Referral</SelectItem>
                          <SelectItem value="Website">Website</SelectItem>
                          <SelectItem value="Social Media">Social Media</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="business_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ""}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="E-commerce">E-commerce</SelectItem>
                          <SelectItem value="SaaS">SaaS</SelectItem>
                          <SelectItem value="Healthcare">Healthcare</SelectItem>
                          <SelectItem value="Education">Education</SelectItem>
                          <SelectItem value="Real Estate">Real Estate</SelectItem>
                          <SelectItem value="Finance">Finance</SelectItem>
                          <SelectItem value="Retail">Retail</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="region_city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="New York" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="region_state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ""}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a state" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="AL">Alabama</SelectItem>
                          <SelectItem value="AK">Alaska</SelectItem>
                          <SelectItem value="AZ">Arizona</SelectItem>
                          <SelectItem value="CA">California</SelectItem>
                          <SelectItem value="CO">Colorado</SelectItem>
                          <SelectItem value="CT">Connecticut</SelectItem>
                          <SelectItem value="FL">Florida</SelectItem>
                          <SelectItem value="GA">Georgia</SelectItem>
                          <SelectItem value="IL">Illinois</SelectItem>
                          <SelectItem value="NY">New York</SelectItem>
                          <SelectItem value="TX">Texas</SelectItem>
                          <SelectItem value="WA">Washington</SelectItem>
                          {/* Add other states as needed */}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
                className="p-0 h-auto font-normal text-primary"
              >
                {isAdvancedOpen ? "Hide Advanced Options" : "Show Advanced Options"}
              </Button>
              
              {isAdvancedOpen && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="score"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Score (1-5)</FormLabel>
                        <Select onValueChange={(val) => field.onChange(parseInt(val))} value={field.value?.toString() || "3"}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Rate priority" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1">1 - Low</SelectItem>
                            <SelectItem value="2">2</SelectItem>
                            <SelectItem value="3">3 - Medium</SelectItem>
                            <SelectItem value="4">4</SelectItem>
                            <SelectItem value="5">5 - High</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || ""}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="interested">Interested</SelectItem>
                            <SelectItem value="negotiation">Negotiation</SelectItem>
                            <SelectItem value="lost">Lost</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="first_contact_at"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>First Contact Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="next_follow_up_at"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Next Follow-up</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value || undefined}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="call_summary"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Call Summary</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Summary of initial call..."
                            className="min-h-[80px]"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Additional notes..."
                            className="min-h-[80px]"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </form>
          </Form>
        </ScrollArea>
        
        <DialogFooter className="mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            onClick={form.handleSubmit(handleSubmit)}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Saving..."
              : mode === "create"
              ? "Create Prospect"
              : "Update Prospect"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProspectFormDialog; 