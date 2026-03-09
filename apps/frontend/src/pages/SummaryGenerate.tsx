import React from "react";
import { ArrowLeft, CalendarRange, FileText, Sparkles } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { Button } from "@/components/common/Button";
import { ROUTES } from "@/constants/routes";
import {
  aiSummariesService,
  type HistoricalSummaryResponse,
} from "@/services/ai-summaries.service";
import { sessionsService, type ClinicalSession } from "@/services/sessions.service";

type GeneratedSummary =
  | {
      mode: "session";
      summary: string;
      sessionId: number;
      generatedAt: string;
    }
  | {
      mode: "historical";
      summary: HistoricalSummaryResponse;
    };

const formatSessionLabel = (session: ClinicalSession) => {
  const parsedDate = new Date(session.sessionDateTime);
  const dateLabel = Number.isNaN(parsedDate.getTime())
    ? session.sessionDateTime
    : parsedDate.toLocaleString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

  const sessionType = session.sessionType || "Sin modalidad";
  return `${dateLabel} - ${sessionType}`;
};

const formatDateTime = (value: string) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const SummaryGenerate: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const patientId = Number(id);

  const [sessions, setSessions] = React.useState<ClinicalSession[]>([]);
  const [selectedSessionId, setSelectedSessionId] = React.useState<string>("");
  const [dateFrom, setDateFrom] = React.useState<string>("");
  const [dateUntil, setDateUntil] = React.useState<string>("");
  const [generatedSummary, setGeneratedSummary] = React.useState<GeneratedSummary | null>(null);
  const [isLoadingSessions, setIsLoadingSessions] = React.useState(false);
  const [isGeneratingSession, setIsGeneratingSession] = React.useState(false);
  const [isGeneratingHistorical, setIsGeneratingHistorical] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let mounted = true;

    const loadSessions = async () => {
      if (!Number.isFinite(patientId) || patientId <= 0) {
        return;
      }

      try {
        setIsLoadingSessions(true);
        const data = await sessionsService.getPatientSessions(patientId);
        const ordered = [...data].sort((a, b) => {
          return (
            new Date(b.sessionDateTime).getTime() -
            new Date(a.sessionDateTime).getTime()
          );
        });

        if (!mounted) return;
        setSessions(ordered);
        if (ordered.length > 0) {
          setSelectedSessionId(String(ordered[0].id));
        }
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : "No se pudieron cargar las sesiones");
      } finally {
        if (mounted) {
          setIsLoadingSessions(false);
        }
      }
    };

    loadSessions();

    return () => {
      mounted = false;
    };
  }, [patientId]);

  const handleGenerateSessionSummary = async () => {
    if (!selectedSessionId) {
      setError("Selecciona una sesion para generar el resumen.");
      return;
    }

    setError(null);
    setIsGeneratingSession(true);
    try {
      const response = await aiSummariesService.generateSessionSummary(
        patientId,
        Number(selectedSessionId)
      );
      setGeneratedSummary({
        mode: "session",
        summary: response.summary || "No se recibio contenido del resumen.",
        sessionId: Number(selectedSessionId),
        generatedAt: new Date().toISOString(),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al generar resumen de sesion");
    } finally {
      setIsGeneratingSession(false);
    }
  };

  const handleGenerateHistoricalSummary = async () => {
    if (!dateFrom || !dateUntil) {
      setError("Debes completar fecha desde y fecha hasta.");
      return;
    }

    if (dateFrom > dateUntil) {
      setError("La fecha desde no puede ser mayor que la fecha hasta.");
      return;
    }

    setError(null);
    setIsGeneratingHistorical(true);
    try {
      const summary = await aiSummariesService.generateHistoricalSummary(patientId, {
        dateFrom,
        dateUntil,
      });
      setGeneratedSummary({
        mode: "historical",
        summary,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al generar resumen historico");
    } finally {
      setIsGeneratingHistorical(false);
    }
  };

  const isPatientIdInvalid = !Number.isFinite(patientId) || patientId <= 0;

  return (
    <div className="relative min-h-full p-6 lg:p-10">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-20 top-16 h-56 w-56 rounded-full bg-brand-secundario/10 blur-3xl" />
        <div className="absolute right-24 top-20 h-52 w-52 rounded-full bg-brand-terciario/10 blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl space-y-6">
        <Button
          variant="ghost"
          className="w-fit text-slate-600 hover:text-slate-900"
          onClick={() =>
            navigate(
              ROUTES.PATIENT_DETAIL.replace(":id", Number.isFinite(patientId) ? String(patientId) : "")
            )
          }
        >
          <ArrowLeft className="size-4" />
          Volver al perfil del paciente
        </Button>

        <header className="space-y-2">
          <h1 className="text-3xl font-bold text-slate-900">Resumenes IA</h1>
          <p className="text-sm text-slate-600">
            Paciente ID: <span className="font-semibold text-slate-900">{id ?? "-"}</span>
          </p>
          <p className="text-sm text-slate-500">
            Puedes generar resumen por sesion individual o historico por rango de fechas.
          </p>
        </header>

        {isPatientIdInvalid && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            El ID del paciente no es valido.
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-[var(--border)] bg-white p-5 shadow-[0_10px_24px_rgba(9,2,36,0.05)]">
            <div className="mb-4 flex items-center gap-2">
              <FileText className="size-4 text-[var(--brand-secundario)]" />
              <h2 className="text-lg font-semibold text-slate-900">Resumen por sesion</h2>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="ml-1 text-sm font-medium text-gray-800">
                  Sesion clinica
                </label>
                <select
                  value={selectedSessionId}
                  onChange={(event) => setSelectedSessionId(event.target.value)}
                  disabled={isLoadingSessions || sessions.length === 0 || isPatientIdInvalid}
                  className="h-[42px] w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                >
                  {isLoadingSessions && <option value="">Cargando sesiones...</option>}
                  {!isLoadingSessions && sessions.length === 0 && (
                    <option value="">No hay sesiones disponibles</option>
                  )}
                  {!isLoadingSessions &&
                    sessions.map((session) => (
                      <option key={session.id} value={String(session.id)}>
                        {formatSessionLabel(session)}
                      </option>
                    ))}
                </select>
              </div>

              <Button
                className="w-full rounded-xl bg-brand-primario text-white hover:bg-brand-hover-primario"
                onClick={handleGenerateSessionSummary}
                isLoading={isGeneratingSession}
                loadingText="Generando..."
                disabled={
                  isPatientIdInvalid ||
                  isLoadingSessions ||
                  sessions.length === 0 ||
                  !selectedSessionId
                }
              >
                <Sparkles className="size-4" />
                Generar resumen de sesion
              </Button>
            </div>
          </section>

          <section className="rounded-2xl border border-[var(--border)] bg-white p-5 shadow-[0_10px_24px_rgba(9,2,36,0.05)]">
            <div className="mb-4 flex items-center gap-2">
              <CalendarRange className="size-4 text-[var(--brand-terciario)]" />
              <h2 className="text-lg font-semibold text-slate-900">Resumen historico</h2>
            </div>

            <div className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label className="ml-1 text-sm font-medium text-gray-800">Fecha desde</label>
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(event) => setDateFrom(event.target.value)}
                    disabled={isPatientIdInvalid}
                    className="h-[42px] w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="ml-1 text-sm font-medium text-gray-800">Fecha hasta</label>
                  <input
                    type="date"
                    value={dateUntil}
                    onChange={(event) => setDateUntil(event.target.value)}
                    disabled={isPatientIdInvalid}
                    className="h-[42px] w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                </div>
              </div>

              <Button
                className="w-full rounded-xl bg-brand-terciario text-white hover:bg-brand-terciario/90"
                onClick={handleGenerateHistoricalSummary}
                isLoading={isGeneratingHistorical}
                loadingText="Generando..."
                disabled={isPatientIdInvalid || !dateFrom || !dateUntil}
              >
                <Sparkles className="size-4" />
                Generar resumen historico
              </Button>
            </div>
          </section>
        </div>

        <section className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-[0_10px_24px_rgba(9,2,36,0.05)]">
          <h2 className="mb-3 text-lg font-semibold text-slate-900">Resultado</h2>

          {!generatedSummary ? (
            <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
              Aun no se genero ningun resumen.
            </p>
          ) : generatedSummary.mode === "session" ? (
            <div className="space-y-3">
              <div className="text-sm text-slate-600">
                <span className="font-semibold text-slate-900">Tipo:</span> Resumen de sesion
                {" · "}
                <span className="font-semibold text-slate-900">Sesion ID:</span> {generatedSummary.sessionId}
                {" · "}
                <span className="font-semibold text-slate-900">Generado:</span>{" "}
                {formatDateTime(generatedSummary.generatedAt)}
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <pre className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
                  {generatedSummary.summary}
                </pre>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-sm text-slate-600">
                <span className="font-semibold text-slate-900">Tipo:</span> Resumen historico
                {" · "}
                <span className="font-semibold text-slate-900">Rango:</span>{" "}
                {generatedSummary.summary.dateFrom} a {generatedSummary.summary.dateUntil}
                {" · "}
                <span className="font-semibold text-slate-900">Generado:</span>{" "}
                {formatDateTime(generatedSummary.summary.generatedAt)}
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <pre className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
                  {generatedSummary.summary.content}
                </pre>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default SummaryGenerate;
