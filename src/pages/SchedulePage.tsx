import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import MeetingScheduler from '@/components/calendar/MeetingScheduler';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, Calendar } from 'lucide-react';

export default function SchedulePage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [isScheduled, setIsScheduled] = useState(false);
  
  // Obter parâmetros da URL
  const clientId = searchParams.get('clientId');
  const prospectId = searchParams.get('prospectId');
  const attendeeName = searchParams.get('name') || '';
  const attendeeEmail = searchParams.get('email') || '';
  const attendeeTimezone = searchParams.get('timezone') || 'America/New_York';
  
  // Handler para quando a reunião for agendada
  const handleMeetingScheduled = () => {
    setIsScheduled(true);
    toast({
      title: "Reunião agendada com sucesso",
      description: "Você receberá um e-mail com os detalhes da reunião.",
    });
  };
  
  // Determinar título da página
  const getPageTitle = () => {
    if (clientId) return 'Agendar Reunião com Cliente';
    if (prospectId) return 'Agendar Reunião com Prospect';
    return 'Agendar Nova Reunião';
  };
  
  return (
    <>
      <Helmet>
        <title>{getPageTitle()} | CRM</title>
      </Helmet>
      
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6 flex items-center justify-between">
          <Button
            variant="ghost"
            className="flex items-center gap-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" /> Voltar
          </Button>
          
          <h1 className="text-2xl font-bold flex items-center">
            <Calendar className="mr-2 h-6 w-6" />
            {getPageTitle()}
          </h1>
          
          <div className="w-[100px]"></div> {/* Espaçador para centralizar o título */}
        </div>
        
        {isScheduled ? (
          <Card className="max-w-3xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle>Agendamento Concluído</CardTitle>
              <CardDescription>
                Sua reunião foi agendada com sucesso. Você receberá um e-mail com os detalhes.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center pt-4">
              <Button onClick={() => navigate(-1)}>
                Voltar ao CRM
              </Button>
            </CardContent>
          </Card>
        ) : (
          <MeetingScheduler 
            clientId={clientId || undefined}
            prospectId={prospectId || undefined}
            attendeeName={attendeeName}
            attendeeEmail={attendeeEmail}
            attendeeTimezone={attendeeTimezone}
            onMeetingScheduled={handleMeetingScheduled}
          />
        )}
      </div>
    </>
  );
} 