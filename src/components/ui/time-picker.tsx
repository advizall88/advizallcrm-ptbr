import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown } from "lucide-react";

interface TimePickerProps {
  value: string;
  onChange?: (time: string) => void;
  setTime: (time: string) => void;
  className?: string;
  disabled?: boolean;
}

// Função para formatar o número com dois dígitos (ex: 9 -> "09")
const formatNumber = (num: number): string => {
  return num.toString().padStart(2, "0");
};

// Verifica se o horário está no formato correto (HH:MM)
const isValidTime = (value: string): boolean => {
  return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value);
};

export const TimePicker: React.FC<TimePickerProps> = ({
  value,
  onChange,
  setTime,
  className,
  disabled = false,
}) => {
  const [hour, setHour] = useState<number>(0);
  const [minute, setMinute] = useState<number>(0);
  const [inputValue, setInputValue] = useState<string>(value || "00:00");
  const inputRef = useRef<HTMLInputElement>(null);

  // Atualizar estado ao receber novo valor
  useEffect(() => {
    if (value && isValidTime(value)) {
      const [h, m] = value.split(":").map(Number);
      setHour(h);
      setMinute(m);
      setInputValue(value);
    }
  }, [value]);

  // Função para incrementar hora ou minuto
  const increment = (type: "hour" | "minute") => {
    if (type === "hour") {
      const newHour = (hour + 1) % 24;
      setHour(newHour);
      updateTime(newHour, minute);
    } else {
      const newMinute = (minute + 5) % 60;
      setMinute(newMinute);
      updateTime(hour, newMinute);
    }
  };

  // Função para decrementar hora ou minuto
  const decrement = (type: "hour" | "minute") => {
    if (type === "hour") {
      const newHour = (hour - 1 + 24) % 24;
      setHour(newHour);
      updateTime(newHour, minute);
    } else {
      const newMinute = (minute - 5 + 60) % 60;
      setMinute(newMinute);
      updateTime(hour, newMinute);
    }
  };

  // Atualizar o valor do tempo
  const updateTime = (h: number, m: number) => {
    const formattedTime = `${formatNumber(h)}:${formatNumber(m)}`;
    setInputValue(formattedTime);
    setTime(formattedTime);
    onChange?.(formattedTime);
  };

  // Lidar com a mudança manual do input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    // Validar e atualizar o tempo se for válido
    if (isValidTime(value)) {
      const [h, m] = value.split(":").map(Number);
      setHour(h);
      setMinute(m);
      setTime(value);
      onChange?.(value);
    }
  };

  // Validar o tempo quando o input perde o foco
  const handleBlur = () => {
    if (!isValidTime(inputValue)) {
      // Restaurar para o último valor válido
      const formattedTime = `${formatNumber(hour)}:${formatNumber(minute)}`;
      setInputValue(formattedTime);
    }
  };

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="grid grid-cols-3 items-center gap-2">
        <div className="flex flex-col items-center">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => increment("hour")}
            disabled={disabled}
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
          <div className="w-full py-1 text-center">Hora</div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => decrement("hour")}
            disabled={disabled}
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center justify-center text-xl">:</div>
        <div className="flex flex-col items-center">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => increment("minute")}
            disabled={disabled}
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
          <div className="w-full py-1 text-center">Min</div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => decrement("minute")}
            disabled={disabled}
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <Input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        className="mt-2 text-center"
        placeholder="HH:MM"
        disabled={disabled}
      />
    </div>
  );
}; 