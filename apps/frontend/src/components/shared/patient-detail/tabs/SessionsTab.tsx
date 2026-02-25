import { CalendarClock, Clock3, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import * as React from "react";

import { Button } from "@/components/common/Button";
import { ROUTES } from "@/constants/routes";
import { sessionsService, type ClinicalSession } from "@/services/sessions.service";
import { EditSessionDialog } from "@/components/shared/sessions/EditSessionDialog";

import type { PatientTabPanelProps } from "./types";
import { BulletList, PanelShell, SectionCard, StatusBadge } from "./ui";

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

const mapSessionToViewModel = (session: ClinicalSession): SessionViewModel => {
  const sessionDate = new Date(session.sessionDateTime);
  const now = new Date();
  
  // Determinar el estado basado en la fecha
  const isPast = sessionDate < now;
  const status: SessionViewModel["status"] = isPast ? "completada" : "programada";

  return {
    id: `SES-${String(session.id).padStart(3, '0')}`,
    date: sessionDate.toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    durationMinutes: session.duration || 50,
    modality: session.sessionType || 'Presencial',
    status,
    focus: session.hypothesis || session.observations?.split('\n')[0] || 'Sesión clínica',
    highlights: session.observations 
      ? session.observations.split('\n').filter(Boolean).slice(0, 3)
      : ['Sin observaciones'],
    tasks: session.therapeuticGoals
      ? session.therapeuticGoals.split('\n').filter(Boolean).slice(0, 2)
      : ['Sin tareas'],
  };
};

export function SessionsTab({ patient }: PatientTabPanelProps) {
  const navigate = useNavigate();
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
      // Ordenar por fecha descendente (más reciente primero)
      mapped.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setSessions(mapped);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar sesiones');
      setSessions([]);
      setRawSessions([]);
    } finally {
      setIsLoading(false);
    }
  }, [patient.profile.id]);

  React.useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  const handleEditSession = (sessionId: string) => {
    const numericId = Number(sessionId.replace('SES-', ''));
    const session = rawSessions.find(s => s.id === numericId);
    if (session) {
      setEditingSession(session);
      setEditDialogOpen(true);
    }
  };

  const handleUpdateSession = async (sessionId: number, values: any) => {
    await sessionsService.updateSession(patient.profile.numericId, sessionId, values);
    await loadSessions(); // Recargar sesiones después de actualizar
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
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-700 text-sm font-medium">{error}</p>
        </div>
      </PanelShell>
    );
  }

  return (
    <PanelShell>
      <div className="space-y-4">
        {sessions.length === 0 ? (
          <div className="bg-[var(--brand-acento)] border border-[var(--border)] rounded-2xl p-8 text-center">
            <p className="text-slate-500">No hay sesiones registradas para este paciente</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map((session) => (
              <article
                key={session.id}
                className="rounded-2xl border border-[var(--border)] bg-white p-4 shadow-[0_10px_24px_rgba(9,2,36,0.05)]"
              >
                <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-semibold text-[var(--brand-primario)]">
                      Sesion {session.modality}
                    </h3>
                    <StatusBadge status={session.status} />
                  </div>
                  <div className="flex items-center gap-3">
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
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditSession(session.id)}
                      className="h-8 w-8 text-slate-400 hover:text-[var(--brand-secundario)]"
                      title="Editar sesión"
                    >
                      <Pencil className="size-4" />
                    </Button>
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

