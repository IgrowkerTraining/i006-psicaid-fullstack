import React, { useState } from 'react';
import { Clock } from 'lucide-react';
import { Button } from './Button';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

interface TimePickerProps {
  value: string; // Formato "HH:mm"
  onChange: (time: string) => void;
  disabled?: boolean;
}

export function TimePicker({ value, onChange, disabled }: TimePickerProps) {
  const [open, setOpen] = useState(false);

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = [0, 15, 30, 45];

  const [selectedHour, selectedMinute] = value.split(':').map(Number);

  const handleHourClick = (hour: number) => {
    const newTime = `${String(hour).padStart(2, '0')}:${String(selectedMinute).padStart(2, '0')}`;
    onChange(newTime);
  };

  const handleMinuteClick = (minute: number) => {
    const newTime = `${String(selectedHour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    onChange(newTime);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          className="h-[42px] w-full justify-start border-slate-300 bg-white text-left font-normal hover:bg-white text-slate-900"
        >
          <Clock className="size-4" />
          {value || 'Seleccionar hora'}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <style>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: white;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: var(--brand-secundario);
            border-radius: 3px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: var(--brand-secundario);
            opacity: 0.8;
          }
        `}</style>
        <div className="flex w-[180px]">
          {/* Columna de horas */}
          <div className="flex-1 border-r border-slate-200">
            <div className="bg-slate-50 px-2 py-1.5 text-center text-xs font-semibold text-slate-600 border-b border-slate-200">
              Hora
            </div>
            <div className="max-h-[180px] overflow-y-auto custom-scrollbar">
              {hours.map((hour) => (
                <button
                  key={hour}
                  type="button"
                  onClick={() => handleHourClick(hour)}
                  className={`w-full px-3 py-1.5 text-sm text-center hover:bg-[var(--brand-secundario)]/10 transition-colors ${
                    hour === selectedHour
                      ? 'bg-[var(--brand-secundario)] text-white font-semibold hover:bg-[var(--brand-terciario)]'
                      : 'text-slate-700'
                  }`}
                >
                  {String(hour).padStart(2, '0')}
                </button>
              ))}
            </div>
          </div>

          {/* Columna de minutos */}
          <div className="flex-1">
            <div className="bg-slate-50 px-2 py-1.5 text-center text-xs font-semibold text-slate-600 border-b border-slate-200">
              Min
            </div>
            <div className="flex flex-col">
              {minutes.map((minute) => (
                <button
                  key={minute}
                  type="button"
                  onClick={() => handleMinuteClick(minute)}
                  className={`w-full px-3 py-2 text-sm text-center hover:bg-[var(--brand-secundario)]/10 transition-colors ${
                    minute === selectedMinute
                      ? 'bg-[var(--brand-secundario)] text-white font-semibold hover:bg-[var(--brand-terciario)]'
                      : 'text-slate-700'
                  }`}
                >
                  {String(minute).padStart(2, '0')}
                </button>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
