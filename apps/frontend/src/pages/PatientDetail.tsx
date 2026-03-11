import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Plus } from "lucide-react";

import PatientDetailHeader from "@/components/shared/patient-detail/PatientDetailHeader";
import PatientDetailTabs from "@/components/shared/patient-detail/PatientDetailTabs";
import GenerateSummaryDialog from "@/components/shared/patient-detail/GenerateSummaryDialog";
import { buildPatientDetail } from "@/components/shared/patient-detail/patientDetail";
import { Button } from "@/components/common/Button";
import { LoadingSpinner } from "@/components/layout/LoadingSpinner";
import { NewSessionDialog } from "@/components/shared/sessions/NewSessionDialog";
import { ROUTES } from "@/constants/routes";
import { patientsService, type Patient } from "@/services/patients.service";
import {
  aiSummariesService,
  type HistoricalSummariesPageResponse,
} from "@/services/ai-summaries.service";
import type { TabId } from "@/components/shared/patient-detail/tabs";

type PatientDetailLocationState = {
  patient?: Patient;
  initialTab?: TabId;
  openGenerateSummary?: boolean;
} | null;

const PatientDetail: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const state = (location.state ?? null) as PatientDetailLocationState;
  
  const [activeTabId, setActiveTabId] = React.useState<TabId>(state?.initialTab ?? "ficha");
  const [sessionRefreshKey, setSessionRefreshKey] = React.useState(0);
  const [treatmentCreateRequestKey, setTreatmentCreateRequestKey] = React.useState(0);
  const [isSummaryDialogOpen, setIsSummaryDialogOpen] = React.useState(
    Boolean(state?.openGenerateSummary)
  );
  const [summaryCreationFeedback, setSummaryCreationFeedback] = React.useState<string | null>(null);
  const [historicalSummariesPage, setHistoricalSummariesPage] =
    React.useState<HistoricalSummariesPageResponse | null>(null);
  const [historicalSummariesLoading, setHistoricalSummariesLoading] = React.useState(false);
  const [historicalSummariesError, setHistoricalSummariesError] = React.useState<string | null>(
    null
  );
  const [historicalSummariesPageIndex, setHistoricalSummariesPageIndex] = React.useState(0);
  const [patient, setPatient] = React.useState<Patient | null>(state?.patient || null);
  // Inicializar loading en false si ya tenemos datos en el state
  const [loading, setLoading] = React.useState(!state?.patient);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let isMounted = true;

    const loadPatient = async () => {
      if (!id) {
        setError("ID de paciente no válido");
        setLoading(false);
        return;
      }

      // Si ya tenemos datos del location.state, no hacer nada más
      if (state?.patient) {
        return;
      }

      // TODO BACKEND: El endpoint GET /api/patients/{id} devuelve error 500
      // Verificar que el backend esté implementado correctamente
      try {
        setLoading(true);
        setError(null);
        const patientData = await patientsService.getById(id);
        if (isMounted) {
          setPatient(patientData);
        }
      } catch (err) {
        if (isMounted) {
          // Si hay error del backend, usar datos mínimos del paciente para no romper la UI
          // Esto permite que la página funcione aunque el endpoint de detalles falle
          console.error("Error al cargar paciente desde backend:", err);
          
          const fallbackPatient: Patient = {
            id: id,
            firstName: "Paciente",
            lastName: `#${id}`,
            birthDate: "2000-01-01",
            sex: "No especificado",
            maritalStatus: "No especificado",
            occupation: "No disponible",
            email: "",
            phone: "",
            reasonConsultation: "Información no disponible",
          };
          
          setPatient(fallbackPatient);
          // Mostrar warning pero no error crítico que bloquee la UI
          console.warn("Usando datos de fallback para el paciente. El backend debe resolver el error 500.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadPatient();

    return () => {
      isMounted = false;
    };
  }, [id, state?.patient]);

  const patientDetail = React.useMemo(
    () => buildPatientDetail(patient, id),
    [patient, id]
  );

  const loadHistoricalSummaries = React.useCallback(
    async (page: number) => {
      if (!Number.isFinite(patientDetail.profile.numericId) || patientDetail.profile.numericId <= 0) {
        setHistoricalSummariesPage(null);
        setHistoricalSummariesError("No se pudo determinar el paciente para cargar resumenes.");
        return;
      }

      setHistoricalSummariesLoading(true);
      setHistoricalSummariesError(null);

      try {
        const response = await aiSummariesService.getHistoricalSummaries(
          patientDetail.profile.numericId,
          {
            page,
            size: 5,
          }
        );
        setHistoricalSummariesPage(response);
        setHistoricalSummariesPageIndex(response.number);
      } catch (err) {
        setHistoricalSummariesError(
          err instanceof Error ? err.message : "No se pudieron cargar los resumenes."
        );
      } finally {
        setHistoricalSummariesLoading(false);
      }
    },
    [patientDetail.profile.numericId]
  );

  React.useEffect(() => {
    if (patientDetail.profile.numericId > 0) {
      void loadHistoricalSummaries(historicalSummariesPageIndex);
    }
  }, [historicalSummariesPageIndex, loadHistoricalSummaries, patientDetail.profile.numericId]);

  const handleOpenSummaryDialog = React.useCallback(() => {
    setSummaryCreationFeedback(null);
    setIsSummaryDialogOpen(true);
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner message="Cargando paciente..." />
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <p className="text-lg text-slate-600">{error || "Paciente no encontrado"}</p>
        <Button onClick={() => navigate(ROUTES.PATIENTS)}>
          Volver a pacientes
        </Button>
      </div>
    );
  }

  return (
    <div className="relative min-h-full">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-32 top-24 h-56 w-56 rounded-full bg-brand-secundario/10 blur-3xl" />
        <div className="absolute right-24 top-20 h-52 w-52 rounded-full bg-brand-terciario/12 blur-3xl" />
        <div className="absolute bottom-10 left-1/3 h-44 w-44 rounded-full bg-brand-secundario/8 blur-3xl" />
      </div>

        <PatientDetailHeader
          patient={patientDetail}
          onBack={() => navigate(ROUTES.PATIENTS)}
        >
          {activeTabId === "sesiones" && (
            <NewSessionDialog
              patientId={patientDetail.profile.numericId}
              onSessionCreated={() => setSessionRefreshKey((k) => k + 1)}
            />
          )}
          {activeTabId === "tratamientos" && (
            <Button
              onClick={() => setTreatmentCreateRequestKey((k) => k + 1)}
              className="rounded-xl bg-brand-primario px-4 text-white hover:bg-brand-hover-primario cursor-pointer"
            >
              <Plus className="size-4" />
              Nuevo tratamiento
            </Button>
          )}

          {activeTabId === "resumen" && (
            <Button
              onClick={handleOpenSummaryDialog}
              className="rounded-xl bg-brand-primario px-4 text-white hover:bg-brand-hover-primario cursor-pointer"
            >
              <Plus className="size-4" />
              Generar Resumen IA
            </Button>
          )}
        </PatientDetailHeader>
        <PatientDetailTabs
          patient={patientDetail}
          activeTabId={activeTabId}
          sessionRefreshKey={sessionRefreshKey}
          treatmentCreateRequestKey={treatmentCreateRequestKey}
          onActiveTabChange={setActiveTabId}
          onOpenGenerateSummary={handleOpenSummaryDialog}
          summaries={historicalSummariesPage?.content ?? []}
          summariesPage={
            historicalSummariesPage
              ? {
                  number: historicalSummariesPage.number,
                  totalPages: historicalSummariesPage.totalPages,
                  totalElements: historicalSummariesPage.totalElements,
                  first: historicalSummariesPage.first,
                  last: historicalSummariesPage.last,
                }
              : null
          }
          summariesLoading={historicalSummariesLoading}
          summariesError={historicalSummariesError}
          onSummaryPageChange={setHistoricalSummariesPageIndex}
        />
        <GenerateSummaryDialog
          patientId={patientDetail.profile.numericId}
          open={isSummaryDialogOpen}
          onOpenChange={setIsSummaryDialogOpen}
          onGenerated={async (summary) => {
            setHistoricalSummariesPageIndex(0);
            await loadHistoricalSummaries(0);
            setSummaryCreationFeedback(
              `Resumen generado para el rango ${summary.dateFrom} a ${summary.dateUntil}.`
            );
          }}
        />
        {activeTabId === "resumen" && summaryCreationFeedback ? (
          <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            {summaryCreationFeedback}
          </div>
        ) : null}
    </div>
  );
};

export default PatientDetail;


