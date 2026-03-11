import * as React from "react";
import { CalendarClock, Clock3, Pencil } from "lucide-react";

import { Button } from "@/components/common/Button";
import { EditSessionDialog } from "@/components/shared/sessions/EditSessionDialog";
import { sessionsService, type ClinicalSession } from "@/services/sessions.service";

import type { PatientTabPanelProps } from "./types";
import { PanelShell, SectionCard } from "./ui";

type SessionViewModel = {
  id: string;
  date: string;
  durationMinutes: number;
  modality: string;
  status: "completada" | "programada" | "cancelada";
  focus: string;
  highlights: string[];
  tasks: string[];
};

function SessionParagraphList({
  items,
  tone = "secondary",
}: {
  items: string[];
  tone?: "secondary" | "tertiary" | "primario";
}) {
  const bulletClass =
    tone === "tertiary" ? "bg-[var(--brand-terciario)]" : "bg-[var(--brand-primario)]";

  return (
    <ul className="space-y-3">
      {items.map((item, index) => (
        <li key={`${item}-${index}`} className="flex items-start gap-3 text-sm leading-8 text-slate-700">
          <span className={`mt-[0.7rem] size-2 shrink-0 rounded-full ${bulletClass}`} />
          <span className="min-w-0">{item}</span>
        </li>
      ))}
    </ul>
  );
}

const mapSessionToViewModel = (session: ClinicalSession): SessionViewModel => {
  const sessionDate = new Date(session.sessionDateTime);
  const now = new Date();
  const isPast = sessionDate < now;
  const status: SessionViewModel["status"] = isPast ? "completada" : "programada";

  return {
    id: `SES-${String(session.id).padStart(3, "0")}`,
    date: sessionDate.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
    durationMinutes: session.duration || 50,
    modality: session.sessionType || "Presencial",
    status,
    focus: session.hypothesis || session.observations?.split("\n")[0] || "Sesion clinica",
    highlights: [session.observations?.trim() || "Sin observaciones"],
    tasks: [session.hypothesis?.trim() || session.therapeuticGoals?.trim() || "Sin hipotesis"],
  };
};

export function SessionsTab({
  patient,
  sessionRefreshKey,
}: PatientTabPanelProps & { sessionRefreshKey?: number }) {
  const [sessions, setSessions] = React.useState<SessionViewModel[]>([]);
  const [rawSessions, setRawSessions] = React.useState<ClinicalSession[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [editingSession, setEditingSession] = React.useState<ClinicalSession | null>(null);
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);

  const loadSessions = React.useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await sessionsService.getPatientSessions(patient.profile.numericId);
      setRawSessions(data);
      const mapped = data.map(mapSessionToViewModel);
      mapped.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setSessions(mapped);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar sesiones");
      setSessions([]);
      setRawSessions([]);
    } finally {
      setIsLoading(false);
    }
  }, [patient.profile.numericId]);

  React.useEffect(() => {
    void loadSessions();
  }, [loadSessions, sessionRefreshKey]);

  const handleEditSession = (sessionId: string) => {
    const numericId = Number(sessionId.replace("SES-", ""));
    const session = rawSessions.find((item) => item.id === numericId);
    if (session) {
      setEditingSession(session);
      setEditDialogOpen(true);
    }
  };

  const handleUpdateSession = async (sessionId: number, values: any) => {
    await sessionsService.updateSession(patient.profile.numericId, sessionId, values);
    await loadSessions();
  };

  if (isLoading) {
    return (
      <PanelShell>
        <div className="flex items-center justify-center py-12">
          <p className="text-slate-500">Cargando sesiones...</p>
        </div>
      </PanelShell>
    );
  }

  if (error) {
    return (
      <PanelShell>
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-medium text-red-700">{error}</p>
        </div>
      </PanelShell>
    );
  }

  return (
    <PanelShell>
      <div className="space-y-4 p-3">
        {sessions.length === 0 ? (
          <div className="rounded-md border border-[var(--border)] bg-[var(--brand-acento)] p-8 text-center">
            <p className="text-slate-500">No hay sesiones registradas para este paciente</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sessions.map((session) => (
              <article
                key={session.id}
                className="rounded-md border border-[var(--border)] bg-[var(--brand-acento)]/60 p-5 shadow-[0_10px_24px_rgba(9,2,36,0.04)]"
              >
                <div className="mb-4 rounded-sm bg-white px-6 py-5 shadow-[0_8px_20px_rgba(9,2,36,0.04)]">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 flex-1 space-y-3 lg:max-w-[68%]">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-md leading-none font-semibold text-slate-900">
                          {session.id}
                        </h3>
                        <span className="rounded-md bg-brand-primario px-3 py-1 text-sm font-medium text-white">
                          {session.modality}
                        </span>
                      </div>
                      <p className="max-w-full text-sm font-semibold leading-7 text-slate-900">
                        {session.focus}
                      </p>
                    </div>

                    <div className="flex shrink-0 flex-wrap items-center gap-5 text-sm font-medium text-slate-700 lg:justify-end">
                      <span className="inline-flex items-center gap-2">
                        <CalendarClock className="size-5 text-slate-900" />
                        {session.date.replace(",", " -")}
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <Clock3 className="size-5 text-slate-900" />
                        {session.durationMinutes} Min
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditSession(session.id)}
                        className="size-8 cursor-pointer text-slate-900 hover:bg-slate-100 hover:text-slate-900"
                        title="Editar sesion"
                      >
                        <Pencil className="size-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                  <SectionCard title="Observaciones" className="bg-white p-5 shadow-none">
                    <SessionParagraphList items={session.highlights} tone="primario" />
                  </SectionCard>
                  <SectionCard title="Hipótesis" className="bg-white p-5 shadow-none">
                    <SessionParagraphList items={session.tasks} />
                  </SectionCard>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <EditSessionDialog
        session={editingSession}
        patientId={patient.profile.numericId}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onConfirmUpdate={handleUpdateSession}
      />
    </PanelShell>
  );
}

export default SessionsTab;
