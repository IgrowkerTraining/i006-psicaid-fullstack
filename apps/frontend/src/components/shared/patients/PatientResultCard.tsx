import * as React from 'react';
import { Eye, Pencil, Trash2 } from 'lucide-react';

import { cn } from '@/lib/utils';

export type PatientStatus = 'activo' | 'inactivo';

export type PatientResult = {
  id: string;
  fullName: string;
  age: number;
  phone: string;
  email: string;
  diagnosis: string;
  status: PatientStatus;
};

type PatientResultCardProps = {
  patient: PatientResult;
  className?: string;
  onView?: (patientId: string) => void;
  onEdit?: (patientId: string) => void;
  onDelete?: (patientId: string) => void;
};

const statusBadgeClassByType: Record<PatientStatus, string> = {
  activo: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30',
  inactivo: 'bg-slate-600/20 text-slate-300 border border-slate-500/30',
};

type IconActionButtonProps = {
  label: string;
  tone?: 'default' | 'danger';
  onClick?: () => void;
  children: React.ReactNode;
};

function IconActionButton({
  label,
  tone = 'default',
  onClick,
  children,
}: IconActionButtonProps) {
  const toneClasses =
    tone === 'danger'
      ? 'text-rose-400 hover:text-rose-300 hover:bg-rose-500/10'
      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800';

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={!onClick}
      className={cn(
        'rounded-md p-2 transition-colors disabled:cursor-not-allowed disabled:opacity-40',
        toneClasses
      )}
    >
      {children}
    </button>
  );
}

export function PatientResultCard({
  patient,
  className,
  onView,
  onEdit,
  onDelete,
}: PatientResultCardProps) {
  return (
    <article
      className={cn(
        'rounded-2xl border border-slate-700 bg-slate-900/40 p-5',
        className
      )}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 flex-1">
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <h3 className="text-2xl font-semibold text-slate-100">
              {patient.fullName}
            </h3>
            <span
              className={cn(
                'rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide',
                statusBadgeClassByType[patient.status]
              )}
            >
              {patient.status}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2 text-sm text-slate-300 md:grid-cols-3">
            <p>
              <span className="font-semibold text-slate-400">Edad:</span>{' '}
              {patient.age} anos
            </p>
            <p>
              <span className="font-semibold text-slate-400">Telefono:</span>{' '}
              {patient.phone}
            </p>
            <p className="truncate">
              <span className="font-semibold text-slate-400">Email:</span>{' '}
              {patient.email}
            </p>
          </div>

          <p className="mt-2 text-sm text-slate-300">
            <span className="font-semibold text-slate-400">Diagnostico:</span>{' '}
            {patient.diagnosis}
          </p>
        </div>

        <div className="flex items-center gap-1 md:pt-1">
          <IconActionButton
            label="Ver paciente"
            onClick={onView ? () => onView(patient.id) : undefined}
          >
            <Eye className="size-4" />
          </IconActionButton>
          <IconActionButton
            label="Editar paciente"
            onClick={onEdit ? () => onEdit(patient.id) : undefined}
          >
            <Pencil className="size-4" />
          </IconActionButton>
          <IconActionButton
            label="Eliminar paciente"
            tone="danger"
            onClick={onDelete ? () => onDelete(patient.id) : undefined}
          >
            <Trash2 className="size-4" />
          </IconActionButton>
        </div>
      </div>
    </article>
  );
}
