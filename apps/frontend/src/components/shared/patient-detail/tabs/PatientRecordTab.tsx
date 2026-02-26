import { Phone } from "lucide-react";

import type { PatientTabPanelProps } from "./types";
import { LabelValue, PanelShell, SectionCard } from "./ui";

export function PatientRecordTab({ patient }: PatientTabPanelProps) {
  return (
    <PanelShell>
      <SectionCard title="" subtitle="">
        {/* Header con metadatos clave */}
        <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 pb-6 border-b border-slate-200">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--brand-secundario)] mb-1">ID del paciente</p>
            <p className="text-sm font-medium text-slate-700">{patient.profile.id}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--brand-secundario)] mb-1">Frecuencia</p>
            <p className="text-sm font-medium text-slate-700">{patient.profile.sessionFrequency}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--brand-secundario)] mb-1">Proxima sesion</p>
            <p className="text-sm font-medium text-slate-700">{patient.profile.nextSessionDate}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--brand-secundario)] mb-1">Fecha de inicio del tratamiento</p>
            <p className="text-sm font-medium text-slate-700">{patient.profile.treatmentStartDate}</p>
          </div>
        </div>

        {/* Datos personales y contacto */}
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--brand-primario)] mb-4">Datos personales</h3>
            <div className="space-y-3">
              <LabelValue label="Nombre" value={patient.profile.fullName.split(' ')[0] || ''} />
              <LabelValue label="Apellido" value={patient.profile.fullName.split(' ').slice(1).join(' ') || ''} />
              <LabelValue label="Fecha de nacimiento" value={patient.profile.birthDate} />
              <LabelValue label="Edad" value={`${patient.profile.age} años`} />
              <LabelValue label="Ocupacion" value={patient.profile.occupation} />
              <LabelValue label="Sexo" value={patient.profile.sex} />
              <LabelValue label="Estado civil" value={patient.profile.maritalStatus} />
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500 mb-1">Motivo de consulta (actual)</p>
                <p className="text-sm text-slate-700">{patient.clinicalHistory.reasonForConsultation}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--brand-primario)] mb-4">Datos de contacto</h3>
            <div className="space-y-3">
              <LabelValue label="Email" value={patient.contact.email} />
              <LabelValue
                label="Telefono"
                value={
                  <span className="inline-flex items-center gap-2">
                    <Phone className="size-3 text-[var(--brand-terciario)]" />
                    {patient.contact.phone}
                  </span>
                }
              />
            </div>
          </div>
        </div>
      </SectionCard>
    </PanelShell>
  );
}

export default PatientRecordTab;

