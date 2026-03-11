import { cn } from '@/lib/utils';

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
};

const statusBadgeClassByType: Record<PatientStatus, string> = {
  activo: 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30',
  inactivo: 'bg-red-600/20 text-red-500 border border-red-500/30',
};

export function PatientResultCard({
  patient,
  className,
  onView,
}: PatientResultCardProps) {
  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => onView?.(patient.id)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onView?.(patient.id); }}
      className={cn(
        'group relative cursor-pointer rounded-[12px] shadow-sm bg-brand-acento p-4 border border-gray-200 transition-all duration-200 hover:border-brand-primario hover:shadow-md',
        className
      )}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <div className="mb-3">
            <h3 className="text-2xl font-semibold text-gray-800">
              {patient.fullName}
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-x-8 gap-y-1 text-sm text-slate-500">
            <p>
              <span className="font-semibold text-slate-600">Edad:</span>{' '}
              {patient.age} años
            </p>
            <p className="truncate">
              <span className="font-semibold text-slate-600">Email:</span>{' '}
              {patient.email}
            </p>
          </div>
        </div>

        <span
          className={cn(
            'shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide',
            statusBadgeClassByType[patient.status]
          )}
        >
          {patient.status}
        </span>
      </div>
    </article>
  );
}
