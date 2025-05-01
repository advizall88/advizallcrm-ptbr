import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ClientFormData } from '@/services/clientService';
import { Save, X } from 'lucide-react';

interface EditClientProps {
  client: ClientFormData | null;
  onChange: (field: keyof ClientFormData, value: any) => void;
  onSave: () => void;
  onCancel: () => void;
}

const EditClient: React.FC<EditClientProps> = ({
  client,
  onChange,
  onSave,
  onCancel
}) => {
  if (!client) return null;

  return (
    <div className="space-y-4 mt-4">
      <Card>
        <CardHeader>
          <CardTitle>Edit Client Information</CardTitle>
          <CardDescription>
            Update client details and contact information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact_name">Contact Name</Label>
              <Input
                id="contact_name"
                value={client.contact_name || ''}
                onChange={(e) => onChange('contact_name', e.target.value)}
                placeholder="Contact name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="company_name">Company Name</Label>
              <Input
                id="company_name"
                value={client.company_name || ''}
                onChange={(e) => onChange('company_name', e.target.value)}
                placeholder="Company name (optional)"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={client.email || ''}
                onChange={(e) => onChange('email', e.target.value)}
                placeholder="Email address"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={client.phone || ''}
                onChange={(e) => onChange('phone', e.target.value)}
                placeholder="Phone number"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="business_type">Business Type</Label>
              <Input
                id="business_type"
                value={client.business_type || ''}
                onChange={(e) => onChange('business_type', e.target.value)}
                placeholder="Type of business"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={client.status || 'active'} 
                onValueChange={(value) => onChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="delinquent">Delinquent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="full_address">Full Address</Label>
            <Textarea
              id="full_address"
              value={client.full_address || ''}
              onChange={(e) => onChange('full_address', e.target.value)}
              placeholder="Full address"
              rows={2}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              value={client.website || ''}
              onChange={(e) => onChange('website', e.target.value)}
              placeholder="Website URL"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="plan_name">Plan Name</Label>
              <Input
                id="plan_name"
                value={client.plan_name || ''}
                onChange={(e) => onChange('plan_name', e.target.value)}
                placeholder="Service plan"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="monthly_fee">Monthly Fee</Label>
              <Input
                id="monthly_fee"
                type="number"
                value={client.monthly_fee || ''}
                onChange={(e) => onChange('monthly_fee', parseFloat(e.target.value) || 0)}
                placeholder="Monthly fee"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ad_budget">Ad Budget</Label>
              <Input
                id="ad_budget"
                type="number"
                value={client.ad_budget || ''}
                onChange={(e) => onChange('ad_budget', parseFloat(e.target.value) || 0)}
                placeholder="Ad budget"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={client.notes || ''}
              onChange={(e) => onChange('notes', e.target.value)}
              placeholder="Add notes about this client"
              rows={3}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={onCancel}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={onSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default EditClient; 