import React from 'react';
import { 
  Dialog, 
  DialogContent
} from '@/components/ui/dialog';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CalendarIframeProps {
  // Para modo Dialog
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  
  // Para modo inline
  onClose?: () => void;
  
  // URL do calendário (opcional, usa um padrão se não for fornecido)
  calendarUrl?: string;
}

const CalendarIframe: React.FC<CalendarIframeProps> = ({ 
  open, 
  onOpenChange,
  onClose,
  calendarUrl = "https://cal.com/andre-uu15wu"
}) => {
  // Modo dialog (com Dialog do UI)
  if (open !== undefined && onOpenChange) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[1200px] h-[95vh] max-h-[95vh] p-0 overflow-hidden">
          <div className="absolute top-2 right-2 z-50">
            <Button 
              variant="ghost" 
              size="icon" 
              className="bg-white/80 hover:bg-white rounded-full" 
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
          <iframe
            src={calendarUrl}
            width="100%"
            height="100%"
            frameBorder="0"
            style={{ display: 'block' }}
          ></iframe>
        </DialogContent>
      </Dialog>
    );
  }
  
  // Modo inline (sem Dialog) - otimizado para overlay
  return (
    <div className="relative w-full h-full min-h-[700px] bg-white rounded-lg shadow-xl overflow-hidden">
      {onClose && (
        <div className="absolute top-4 right-4 z-50">
          <Button 
            variant="ghost" 
            size="icon" 
            className="bg-white/90 hover:bg-white rounded-full h-8 w-8" 
            onClick={onClose}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
      )}
      <iframe
        src={calendarUrl}
        width="100%"
        height="100%"
        frameBorder="0"
        style={{ display: 'block' }}
        allow="camera; microphone; autoplay; fullscreen"
      ></iframe>
    </div>
  );
};

export default CalendarIframe; 