import * as React from 'react';
import { Search, X } from 'lucide-react';

import { cn } from '@/lib/utils';

type PatientSearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
};

export function PatientSearchInput({
  value,
  onChange,
  placeholder = 'Buscar paciente por nombre, apellido o email...',
  className,
}: PatientSearchInputProps) {
  return (
    <div className={cn('relative', className)}>
      <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-500" />

      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-12 w-full rounded-xl border border-gray-200 bg-brand-acento pl-11 pr-10 text-sm text-brand-primary placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
      />

      {value ? (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-100"
          aria-label="Limpiar busqueda"
        >
          <X className="size-4" />
        </button>
      ) : null}
    </div>
  );
}
