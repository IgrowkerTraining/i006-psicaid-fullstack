import { ArrowLeft } from "lucide-react";

import type { PatientDetailViewModel } from "./types";

type PatientDetailHeaderProps = {
  patient: PatientDetailViewModel;
  onBack: () => void;
  children?: React.ReactNode;
};

export function PatientDetailHeader({ patient, onBack, children }: PatientDetailHeaderProps) {
  return (
    <header className="mb-6">
      <button
        type="button"
        onClick={onBack}
        className="group mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-brand-primario px-4 py-2 text-sm font-medium text-white shadow-[0_8px_20px_rgba(9,2,36,0.06)] transition hover:-translate-y-0.5 hover:border-[var(--brand-secundario)] hover:bg-brand-hover-primario cursor-pointer"
      >
        <ArrowLeft className="size-4 transition group-hover:-translate-x-0.5" />
        Volver a pacientes
      </button>

      <div className="overflow-hidden rounded-3xl border border-white/70 bg-gradient-to-br from-white via-white to-[var(--brand-acento)] p-5 shadow-[0_18px_50px_rgba(9,2,36,0.08)] sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            {patient.profile.fullName}
          </h1>
          {children}
        </div>
      </div>
    </header>
  );
}

export default PatientDetailHeader;

