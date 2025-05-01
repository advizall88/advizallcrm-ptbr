import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Client, Payment } from '@/lib/supabase';
import { Edit, Trash, Plus, Check, X, DollarSign, CalendarIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import { PaymentFormData } from '@/services/clientService';

interface FinanceProps {
  client: Client;
  payments: Payment[];
  onAdd: () => void;
  onEdit: (payment: Payment) => void;
  onDelete: (payment: Payment) => void;
  onToggleStatus: (payment: Payment) => void;
  openForm: boolean;
  setOpenForm: (open: boolean) => void;
  selectedPayment: Payment | null;
  onSave: (data: PaymentFormData) => void;
}

const Finance: React.FC<FinanceProps> = ({
  client,
  payments,
  onAdd,
  onEdit,
  onDelete,
  onToggleStatus,
  openForm,
  setOpenForm,
  selectedPayment,
  onSave
}) => {
  const getStatusBadge = (paid: boolean) => {
    return paid
      ? <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Paid</Badge>
      : <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">Pending</Badge>;
  };

  // Calculate total paid and pending amounts
  const totalPaid = payments
    .filter(p => p.paid)
    .reduce((sum, p) => sum + p.amount, 0);

  const totalPending = payments
    .filter(p => !p.paid)
    .reduce((sum, p) => sum + p.amount, 0);

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  });

  return (
    <div className="space-y-4 mt-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-green-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-800">Total Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{formatter.format(totalPaid)}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-amber-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-amber-800">Pending Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-700">{formatter.format(totalPending)}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-blue-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">Monthly Fee</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">
              {client.monthly_fee ? formatter.format(client.monthly_fee) : 'N/A'}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>
                Payment records for {client.company_name || client.contact_name}
              </CardDescription>
            </div>
            <Button onClick={onAdd} className="ml-auto">
              <Plus className="h-4 w-4 mr-2" />
              Add Payment
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              No payments have been recorded yet.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">
                      {payment.description}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <DollarSign className="h-3 w-3 mr-1 text-muted-foreground" />
                        {formatter.format(payment.amount)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <CalendarIcon className="h-3 w-3 mr-1 text-muted-foreground" />
                        {formatDate(payment.invoice_date)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(payment.paid)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onToggleStatus(payment)}
                          title={payment.paid ? "Mark as Unpaid" : "Mark as Paid"}
                        >
                          {payment.paid ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(payment)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(payment)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Finance; 