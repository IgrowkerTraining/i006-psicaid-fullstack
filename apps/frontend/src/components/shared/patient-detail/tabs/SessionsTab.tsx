import { CalendarClock, Clock3 } from "lucide-react";

import type { PatientTabPanelProps } from "./types";
import { BulletList, PanelShell, SectionCard, StatusBadge } from "./ui";

export function SessionsTab({ patient }: PatientTabPanelProps) {
  return (
    <PanelShell>
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-3">
          <SectionCard title="Sesiones registradas" className="sm:col-span-1">
            <p className="text-3xl font-bold text-[var(--brand-primario)]">{patient.sessions.length}</p>
            <p className="text-sm text-slate-500">Entradas visibles en esta maqueta</p>
          </SectionCard>
          <SectionCard title="Modalidad frecuente" className="sm:col-span-1">
            <p className="text-lg font-semibold text-[var(--brand-primario)]">Teleconsulta</p>
            <p className="text-sm text-slate-500">
              Seguimiento mensual con espacios presenciales puntuales
            </p>
          </SectionCard>
          <SectionCard title="Ultimo foco terapeutico" className="sm:col-span-1">
            <p className="text-sm leading-6 text-slate-700">
              Ansiedad anticipatoria asociada a plazos y revision externa.
            </p>
          </SectionCard>
        </div>

        <div className="space-y-3">
          {patient.sessions.map((session) => (
            <article
              key={session.id}
              className="rounded-2xl border border-[var(--border)] bg-white p-4 shadow-[0_10px_24px_rgba(9,2,36,0.05)]"
            >
              <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-semibold text-[var(--brand-primario)]">
                      {session.id}
                    </h3>
                    <StatusBadge status={session.status} />
                  </div>
                  <p className="mt-1 text-sm text-slate-500">{session.focus}</p>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarClock className="size-4 text-[var(--brand-secundario)]" />
                    {session.date}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock3 className="size-4 text-[var(--brand-terciario)]" />
                    {session.durationMinutes} min
                  </span>
                  <span className="rounded-full border border-[var(--brand-terciario)]/25 bg-[var(--brand-terciario)]/10 px-2 py-1 text-xs font-semibold text-[var(--brand-terciario)]">
                    {session.modality}
                  </span>
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <SectionCard title="Hallazgos" className="bg-[var(--brand-acento)]/40 p-3">
                  <BulletList items={session.highlights} tone="tertiary" />
                </SectionCard>
                <SectionCard title="Tareas acordadas" className="bg-[var(--brand-acento)]/40 p-3">
                  <BulletList items={session.tasks} />
                </SectionCard>
              </div>
            </article>
          ))}
        </div>
      </div>
    </PanelShell>
  );
}

export default SessionsTab;

