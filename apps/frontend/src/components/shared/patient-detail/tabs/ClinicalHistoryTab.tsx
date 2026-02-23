import type { PatientTabPanelProps } from "./types";
import { BulletList, LabelValue, PanelShell, SectionCard } from "./ui";

export function ClinicalHistoryTab({ patient }: PatientTabPanelProps) {
  const profile = patient.profile;
  const history = patient.clinicalHistory;

  return (
    <PanelShell>
      <div className="space-y-4">
        <div className="grid gap-4 lg:grid-cols-2">
          <SectionCard title="Ficha clinica">
            <div className="space-y-3">
              <LabelValue label="Identificador del paciente" value={profile.id} />
              <div className="grid gap-3 sm:grid-cols-2">
                <LabelValue label="Nombre completo" value={profile.fullName} />
                <LabelValue label="Edad" value={`${profile.age} anos`} />
                <LabelValue label="Sexo" value={profile.sex} />
                <LabelValue label="Estado civil" value={profile.maritalStatus} />
                <LabelValue label="Ocupacion" value={profile.occupation} />
                <LabelValue label="Inicio tratamiento" value={profile.treatmentStartDate} />
                <LabelValue label="Frecuencia" value={profile.sessionFrequency} />
              </div>
              <LabelValue label="Motivo de consulta" value={history.reasonForConsultation} />
            </div>
          </SectionCard>

          <SectionCard title="Diagnostico e intervenciones">
            <div className="space-y-4">
              <LabelValue label="Diagnostico" value={history.diagnosis} />
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--brand-secundario)]">
                  Intervenciones realizadas
                </p>
                <BulletList items={history.interventions} />
              </div>
            </div>
          </SectionCard>
        </div>

        <div className="grid gap-4">
          <SectionCard title="Antecedentes relevantes">
            <p className="text-sm leading-7 text-slate-700">{history.relevantHistory}</p>
          </SectionCard>

          <SectionCard title="Observaciones clinicas">
            <p className="text-sm leading-7 text-slate-700">{history.clinicalObservations}</p>
          </SectionCard>

          <SectionCard title="Hipotesis clinica de trabajo">
            <p className="text-sm leading-7 text-slate-700">{history.clinicalHypothesis}</p>
          </SectionCard>

          <SectionCard title="Evolucion desde la sesion anterior">
            <p className="text-sm leading-7 text-slate-700">{history.priorSessionEvolution}</p>
          </SectionCard>

          <SectionCard title="Objetivos terapeuticos actuales">
            <p className="text-sm leading-7 text-slate-700">{history.therapeuticGoals}</p>
          </SectionCard>

          <SectionCard title="Observaciones adicionales">
            <p className="text-sm leading-7 text-slate-700">{history.additionalObservations}</p>
          </SectionCard>
        </div>
      </div>
    </PanelShell>
  );
}

export default ClinicalHistoryTab;

