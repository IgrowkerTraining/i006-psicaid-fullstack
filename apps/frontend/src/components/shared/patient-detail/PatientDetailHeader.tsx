import { ArrowLeft, CalendarDays, ShieldCheck, Stethoscope } from "lucide-react";

import type { PatientDetailViewModel } from "./types";

type PatientDetailHeaderProps = {
  patient: PatientDetailViewModel;
  onBack: () => void;
};

const InfoChip = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => (
  <div className="rounded-2xl border border-white/60 bg-white/85 px-4 py-3 shadow-[0_10px_24px_rgba(9,2,36,0.08)] backdrop-blur">
    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--brand-secundario)]">
      {label}
    </p>
    <p className="mt-1 text-sm font-semibold text-[var(--brand-primario)]">{value}</p>
  </div>
);

export function PatientDetailHeader({ patient, onBack }: PatientDetailHeaderProps) {
  return (
    <header className="mb-6">
      <button
        type="button"
        onClick={onBack}
        className="group mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white/80 px-4 py-2 text-sm font-medium text-[var(--brand-primario)] shadow-[0_8px_20px_rgba(9,2,36,0.06)] transition hover:-translate-y-0.5 hover:border-[var(--brand-secundario)] hover:text-[var(--brand-secundario)]"
      >
        <ArrowLeft className="size-4 transition group-hover:-translate-x-0.5" />
        Volver a pacientes
      </button>

      <div className="overflow-hidden rounded-3xl border border-white/70 bg-gradient-to-br from-white via-white to-[var(--brand-acento)] p-5 shadow-[0_18px_50px_rgba(9,2,36,0.08)] sm:p-6">
        <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded-full border border-[var(--brand-terciario)]/35 bg-[var(--brand-terciario)]/10 px-3 py-1 text-xs font-semibold text-[var(--brand-terciario)]">
                Ficha paciente
              </span>
              <span className="inline-flex items-center rounded-full border border-[var(--brand-secundario)]/35 bg-[var(--brand-secundario)]/10 px-3 py-1 text-xs font-semibold text-[var(--brand-secundario)]">
                {patient.profile.status === "activo" ? "Paciente activo" : "Paciente inactivo"}
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-[var(--brand-primario)] sm:text-3xl">
              {patient.profile.fullName}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-600">
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="size-4 text-[var(--brand-secundario)]" />
                {patient.profile.id}
              </span>
              <span className="inline-flex items-center gap-2">
                <Stethoscope className="size-4 text-[var(--brand-terciario)]" />
                {patient.profile.therapistName} · {patient.profile.specialty}
              </span>
              <span className="inline-flex items-center gap-2">
                <CalendarDays className="size-4 text-[var(--brand-secundario)]" />
                Proxima sesion: {patient.profile.nextSessionDate}
              </span>
            </div>
          </div>

          <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:w-[26rem]">
            <InfoChip label="Diagnostico" value={patient.clinicalHistory.diagnosis} />
            <InfoChip label="Frecuencia" value={patient.profile.sessionFrequency} />
            <InfoChip label="Ultima sesion" value={patient.profile.lastSessionDate} />
            <InfoChip label="Inicio tratamiento" value={patient.profile.treatmentStartDate} />
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--brand-secundario)]/15 bg-white/80 p-4 shadow-inner">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--brand-secundario)]">
            Motivo de consulta
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            {patient.clinicalHistory.reasonForConsultation}
          </p>
        </div>
      </div>
    </header>
  );
}

export default PatientDetailHeader;

