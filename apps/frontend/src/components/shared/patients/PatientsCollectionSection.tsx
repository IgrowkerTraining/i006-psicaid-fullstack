import * as React from "react";

import {
  type PatientResult,
  PatientResultCard,
} from "@/components/shared/patients/PatientResultCard";

type PatientsCollectionSectionProps = {
  loading: boolean;
  error: string | null;
  showEmptyState: boolean;
  showNoResultsState: boolean;
  searchValue: string;
  patients: PatientResult[];
  onViewPatient: (patientId: string) => void;
  onEditPatient: (patientId: string) => void;
  onDeactivatePatient: (patientId: string) => void;
};

const SKELETON_ITEMS = 3;

const PatientCardSkeleton: React.FC = () => (
  <article className="rounded-2xl border border-gray-200 bg-brand-acento p-5 shadow-sm">
    <div className="animate-pulse">
      <div className="mb-4 h-7 w-56 rounded bg-slate-700/40" />
      <div className="mb-2 h-4 w-full rounded bg-slate-700/30" />
      <div className="mb-2 h-4 w-4/5 rounded bg-slate-700/30" />
      <div className="h-4 w-3/5 rounded bg-slate-700/30" />
    </div>
  </article>
);

export function PatientsCollectionSection({
  loading,
  error,
  showEmptyState,
  showNoResultsState,
  searchValue,
  patients,
  onViewPatient,
  onEditPatient,
  onDeactivatePatient,
}: PatientsCollectionSectionProps) {
  return (
    <div className="space-y-4">
      {loading &&
        Array.from({ length: SKELETON_ITEMS }).map((_, index) => (
          <PatientCardSkeleton key={`patient-skeleton-${index}`} />
        ))}

      {error && (
        <div className="rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {showEmptyState && (
        <div className="rounded-2xl border border-gray-200 bg-brand-acento p-6 text-center">
          <h2 className="text-lg font-semibold text-gray-700">Aun no hay pacientes</h2>
          <p className="mt-1 text-sm text-slate-500">
            Crea tu primer paciente para comenzar a gestionar su informacion.
          </p>
        </div>
      )}

      {showNoResultsState && (
        <div className="rounded-2xl border border-gray-200 bg-brand-acento p-6 text-center">
          <h2 className="text-lg font-semibold text-gray-700">Sin resultados</h2>
          <p className="mt-1 text-sm text-slate-500">
            No encontramos pacientes que coincidan con "{searchValue}".
          </p>
        </div>
      )}

      {!loading &&
        !error &&
        patients.map((patient) => (
          <PatientResultCard
            key={patient.id}
            patient={patient}
            onView={onViewPatient}
            onEdit={onEditPatient}
            onDelete={onDeactivatePatient}
          />
        ))}
    </div>
  );
}
