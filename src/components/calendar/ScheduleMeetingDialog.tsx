import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import MeetingScheduler from './MeetingScheduler';

interface ScheduleMeetingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientId?: string; // Para reuniões com clientes
  prospectId?: string; // Para reuniões com prospectos
  attendeeName?: string;
  attendeeEmail?: string;
  attendeeTimezone?: string;
}

const ScheduleMeetingDialog: React.FC<ScheduleMeetingDialogProps> = ({
  open,
  onOpenChange,
  clientId,
  prospectId,
  attendeeName = '',
  attendeeEmail = '',
  attendeeTimezone = 'America/New_York'
}) => {
  // Handler para quando a reunião for agendada com sucesso
  const handleMeetingScheduled = () => {
    // Fechar o diálogo após um breve delay para permitir que o usuário veja a confirmação
    setTimeout(() => {
      onOpenChange(false);
    }, 2000);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Agendar Reunião</DialogTitle>
        </DialogHeader>
        
        <MeetingScheduler 
          clientId={clientId}
          prospectId={prospectId}
          attendeeName={attendeeName}
          attendeeEmail={attendeeEmail}
          attendeeTimezone={attendeeTimezone}
          onMeetingScheduled={handleMeetingScheduled}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleMeetingDialog; 