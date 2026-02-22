import { Eye, Pencil, Trash2 } from 'lucide-react';

import { cn } from '@/lib/utils';
import IconActionButton from './IconActionButton';

export type PatientStatus = 'activo' | 'inactivo';

export type PatientResult = {
  id: string;
  fullName: string;
  age: number;
  phone: string;
  email: string;
  occupation: string;
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
  activo: 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30',
  inactivo: 'bg-red-600/20 text-red-500 border border-red-500/30',
};

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
        'rounded-2xl shadow-sm bg-brand-acento p-5 border border-gray-200',
        className
      )}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 flex-1">
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <h3 className="text-2xl font-semibold text-gray-800">
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

          <div className="grid grid-cols-1 gap-2 text-sm text-slate-500 md:grid-cols-3">
            <p>
              <span className="font-semibold text-slate-600">Edad:</span>{' '}
              {patient.age} años
            </p>
            <p>
              <span className="font-semibold text-slate-600">Telefono:</span>{' '}
              {patient.phone}
            </p>
            <p className="truncate">
              <span className="font-semibold text-slate-600">Email:</span>{' '}
              {patient.email}
            </p>
          </div>

          <p className="mt-2 text-sm text-slate-500">
            <span className="font-semibold text-slate-600">Ocupacion:</span>{' '}
            {patient.occupation}
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
