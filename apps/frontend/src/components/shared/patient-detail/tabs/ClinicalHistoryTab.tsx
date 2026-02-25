import type { PatientTabPanelProps } from "./types";
import { BulletList, PanelShell, SectionCard } from "./ui";

export function ClinicalHistoryTab({ patient }: PatientTabPanelProps) {
  const history = patient.clinicalHistory;

  return (
    <PanelShell>
      <SectionCard title="" subtitle="">
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-bold text-[var(--brand-primario)] mb-2">Diagnostico:</h3>
            <p className="text-sm leading-relaxed text-slate-700">{history.diagnosis}</p>
          </div>

          <div>
            <h3 className="text-sm font-bold text-[var(--brand-primario)] mb-2">Antecedentes relevantes:</h3>
            <p className="text-sm leading-relaxed text-slate-700">{history.relevantHistory}</p>
          </div>

          <div>
            <h3 className="text-sm font-bold text-[var(--brand-primario)] mb-2">Intervenciones realizadas:</h3>
            <BulletList items={history.interventions} />
          </div>

          <div>
            <h3 className="text-sm font-bold text-[var(--brand-primario)] mb-2">Observaciones clinicas:</h3>
            <p className="text-sm leading-relaxed text-slate-700">{history.clinicalObservations}</p>
          </div>

          <div>
            <h3 className="text-sm font-bold text-[var(--brand-primario)] mb-2">Objetivos terapeuticos actuales:</h3>
            <p className="text-sm leading-relaxed text-slate-700">{history.therapeuticGoals}</p>
          </div>

          <div>
            <h3 className="text-sm font-bold text-[var(--brand-primario)] mb-2">Observaciones adicionales:</h3>
            <p className="text-sm leading-relaxed text-slate-700">{history.additionalObservations}</p>
          </div>

          <div>
            <h3 className="text-sm font-bold text-[var(--brand-primario)] mb-2">Evolucion desde la sesion anterior:</h3>
            <p className="text-sm leading-relaxed text-slate-700">{history.priorSessionEvolution}</p>
          </div>
        </div>
      </SectionCard>
    </PanelShell>
  );
}

export default ClinicalHistoryTab;

