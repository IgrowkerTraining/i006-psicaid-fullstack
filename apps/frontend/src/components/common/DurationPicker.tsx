import React, { useState } from 'react';
import { Clock } from 'lucide-react';
import { Button } from './Button';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

interface DurationPickerProps {
  value: number | undefined;
  onChange: (duration: number) => void;
  disabled?: boolean;
}

export function DurationPicker({ value, onChange, disabled }: DurationPickerProps) {
  const [open, setOpen] = useState(false);

  // Duraciones comunes en minutos
  const durations = [20,30, 45, 50, 60, 75, 90];

  const handleDurationClick = (duration: number) => {
    onChange(duration);
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
          {value ? `${value} min` : 'Seleccionar'}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[140px] p-0" align="start">
        <div>
          <div className="bg-slate-50 px-3 py-1.5 text-center text-xs font-semibold text-slate-600 border-b border-slate-200">
            Duración
          </div>
          <div className="flex flex-col">
            {durations.map((duration) => (
              <button
                key={duration}
                type="button"
                onClick={() => handleDurationClick(duration)}
                className={`w-full px-4 py-2.5 text-sm text-center hover:bg-[var(--brand-secundario)]/10 transition-colors ${
                  duration === value
                    ? 'bg-[var(--brand-secundario)] text-white font-semibold hover:bg-[var(--brand-terciario)]'
                    : 'text-slate-700'
                }`}
              >
                {duration} min
              </button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
