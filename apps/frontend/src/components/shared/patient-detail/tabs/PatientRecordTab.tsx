import { MapPin, Phone } from "lucide-react";

import type { PatientTabPanelProps } from "./types";
import { LabelValue, PanelShell, SectionCard } from "./ui";

export function PatientRecordTab({ patient }: PatientTabPanelProps) {
  return (
    <PanelShell>
      <div className="grid gap-4 xl:grid-cols-[1.15fr_1fr]">
        <SectionCard title="Datos personales" subtitle="Informacion general del paciente">
          <div className="grid gap-4 sm:grid-cols-2">
            <LabelValue label="Nombre completo" value={patient.profile.fullName} />
            <LabelValue label="Identificador" value={patient.profile.id} />
            <LabelValue label="Edad" value={`${patient.profile.age} anos`} />
            <LabelValue label="Fecha de nacimiento" value={patient.profile.birthDate} />
            <LabelValue label="Sexo" value={patient.profile.sex} />
            <LabelValue label="Estado civil" value={patient.profile.maritalStatus} />
            <LabelValue label="Ocupacion" value={patient.profile.occupation} />
            <LabelValue label="Ciudad" value={patient.profile.city} />
          </div>
        </SectionCard>

        <div className="grid gap-4">
          <SectionCard title="Contacto y soporte" subtitle="Datos de referencia rapida">
            <div className="space-y-4">
              <LabelValue
                label="Telefono"
                value={
                  <span className="inline-flex items-center gap-2">
                    <Phone className="size-4 text-[var(--brand-terciario)]" />
                    {patient.contact.phone}
                  </span>
                }
              />
              <LabelValue label="Email" value={patient.contact.email} />
              <LabelValue
                label="Direccion"
                value={
                  <span className="inline-flex items-center gap-2">
                    <MapPin className="size-4 text-[var(--brand-secundario)]" />
                    {patient.contact.address}
                  </span>
                }
              />
              <LabelValue label="Contacto de emergencia" value={patient.contact.emergencyContact} />
            </div>
          </SectionCard>

          <SectionCard title="Seguimiento" subtitle="Datos administrativos del proceso">
            <div className="grid gap-4 sm:grid-cols-2">
              <LabelValue label="Inicio de tratamiento" value={patient.profile.treatmentStartDate} />
              <LabelValue label="Frecuencia de sesiones" value={patient.profile.sessionFrequency} />
              <LabelValue label="Ultima sesion" value={patient.profile.lastSessionDate} />
              <LabelValue label="Proxima sesion" value={patient.profile.nextSessionDate} />
            </div>
          </SectionCard>
        </div>
      </div>
    </PanelShell>
  );
}

export default PatientRecordTab;

