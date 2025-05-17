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
          <CardTitle>Editar Informações do Cliente</CardTitle>
          <CardDescription>
            Atualize as informações do cliente e as informações de contato
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact_name">Nome do Contato</Label>
              <Input
                id="contact_name"
                value={client.contact_name || ''}
                onChange={(e) => onChange('contact_name', e.target.value)}
                placeholder="Nome do contato"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="company_name">Nome da Empresa</Label>
              <Input
                id="company_name"
                value={client.company_name || ''}
                onChange={(e) => onChange('company_name', e.target.value)}
                placeholder="Nome da empresa (opcional)"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={client.email || ''}
                onChange={(e) => onChange('email', e.target.value)}
                placeholder="Endereço de email"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={client.phone || ''}
                onChange={(e) => onChange('phone', e.target.value)}
                placeholder="Número de telefone"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="business_type">Tipo de Negócio</Label>
              <Input
                id="business_type"
                value={client.business_type || ''}
                onChange={(e) => onChange('business_type', e.target.value)}
                placeholder="Tipo de negócio"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={client.status || 'active'} 
                onValueChange={(value) => onChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                  <SelectItem value="delinquent">Inadimplente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="region_city">Cidade</Label>
              <Input
                id="region_city"
                value={client.region_city || ''}
                onChange={(e) => onChange('region_city', e.target.value)}
                placeholder="Cidade"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="region_state">Estado</Label>
              <Input
                id="region_state"
                value={client.region_state || ''}
                onChange={(e) => onChange('region_state', e.target.value)}
                placeholder="Estado"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="full_address">Endereço</Label>
              <Textarea
                id="full_address"
                value={client.full_address || ''}
                onChange={(e) => onChange('full_address', e.target.value)}
                placeholder="Endereço"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="zip_code">Código Postal</Label>
              <Input
                id="zip_code"
                value={client.zip_code || ''}
                onChange={(e) => onChange('zip_code', e.target.value)}
                placeholder="Código Postal"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              value={client.website || ''}
              onChange={(e) => onChange('website', e.target.value)}
              placeholder="URL do Website"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="plan_name">Nome do Plano</Label>
              <Input
                id="plan_name"
                value={client.plan_name || ''}
                onChange={(e) => onChange('plan_name', e.target.value)}
                placeholder="Plano de Serviço"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="monthly_fee">Taxa Mensal</Label>
              <Input
                id="monthly_fee"
                type="number"
                value={client.monthly_fee !== undefined && client.monthly_fee !== null ? client.monthly_fee : ''}
                onChange={(e) => onChange('monthly_fee', e.target.value ? parseFloat(e.target.value) : null)}
                placeholder="Taxa mensal (opcional)"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ad_budget">Orçamento de Anúncio</Label>
              <Input
                id="ad_budget"
                type="number"
                value={client.ad_budget !== undefined && client.ad_budget !== null ? client.ad_budget : ''}
                onChange={(e) => onChange('ad_budget', e.target.value ? parseFloat(e.target.value) : null)}
                placeholder="Orçamento de anúncio (opcional)"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notas</Label>
            <Textarea
              id="notes"
              value={client.notes || ''}
              onChange={(e) => onChange('notes', e.target.value)}
              placeholder="Adicione notas sobre este cliente"
              rows={3}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={onCancel}>
            <X className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
          <Button onClick={onSave}>
            <Save className="h-4 w-4 mr-2" />
            Salvar Alterações
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default EditClient; 