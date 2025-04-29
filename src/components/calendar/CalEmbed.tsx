import React, { useEffect, useRef } from 'react';

interface CalEmbedProps {
  username: string;  // Seu nome de usuário no Cal.com
  eventTypeSlug?: string; // Tipo de evento (ex: "reuniao-inicial")
  prefill?: {
    name?: string;
    email?: string;
    notes?: string;
    guests?: string[];
    [key: string]: any;
  };
  className?: string;
  style?: React.CSSProperties;
  calLink?: string; // Link completo opcional (substitui username/eventTypeSlug)
}

/**
 * Componente para incorporar o widget do Cal.com
 * Implementação simplificada seguindo a documentação oficial
 */
const CalEmbed: React.FC<CalEmbedProps> = ({ 
  username, 
  eventTypeSlug = "reuniao-inicial", 
  prefill = {}, 
  className = "",
  style = {},
  calLink
}) => {
  const embedRef = useRef<HTMLDivElement>(null);
  const link = calLink || `${username}/${eventTypeSlug}`;

  useEffect(() => {
    // Carrega o script do Cal.com uma única vez
    const script = document.createElement('script');
    script.src = "https://cal.com/embed.js";
    script.async = true;
    script.onload = () => {
      // Apenas configura o Cal.com quando o script terminar de carregar
      if (window.Cal && embedRef.current) {
        window.Cal("inline", {
          elementOrSelector: embedRef.current,
          calLink: link,
          config: {
            hideEventTypeDetails: false,
            layout: "month_view",
            theme: "light",
            ...prefill
          }
        });
      }
    };
    
    // Se o script já existir, não adiciona outro
    if (!document.querySelector('script[src="https://cal.com/embed.js"]')) {
      document.body.appendChild(script);
    } else if (window.Cal && embedRef.current) {
      // Se o script já estiver carregado, inicializa diretamente
      window.Cal("inline", {
        elementOrSelector: embedRef.current,
        calLink: link,
        config: {
          hideEventTypeDetails: false,
          layout: "month_view",
          theme: "light",
          ...prefill
        }
      });
    }
    
    // Limpa ao desmontar
    return () => {
      // O script permanece para evitar problemas com vários embeds
    };
  }, [link, JSON.stringify(prefill)]);

  return (
    <div 
      className={`cal-embed-container ${className}`}
      style={{
        width: '100%',
        height: '100%',
        minHeight: '600px',
        ...style
      }}
    >
      <div 
        ref={embedRef} 
        style={{ height: '100%', width: '100%' }}
      />
    </div>
  );
};

// Adicionar ao objeto window para TypeScript
declare global {
  interface Window {
    Cal?: any;
  }
}

export default CalEmbed; 