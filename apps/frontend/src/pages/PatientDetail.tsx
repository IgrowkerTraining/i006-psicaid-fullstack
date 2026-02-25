import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Plus } from "lucide-react";

import PatientDetailHeader from "@/components/shared/patient-detail/PatientDetailHeader";
import PatientDetailTabs from "@/components/shared/patient-detail/PatientDetailTabs";
import { buildPatientDetail } from "@/components/shared/patient-detail/patientDetail";
import { Button } from "@/components/common/Button";
import { LoadingSpinner } from "@/components/layout/LoadingSpinner";
import { ROUTES } from "@/constants/routes";
import { patientsService, type Patient } from "@/services/patients.service";
import type { TabId } from "@/components/shared/patient-detail/tabs";

type PatientDetailLocationState = {
  patient?: Patient;
} | null;

const PatientDetail: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const [activeTabId, setActiveTabId] = React.useState<TabId>("ficha");
  const [patient, setPatient] = React.useState<Patient | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const state = (location.state ?? null) as PatientDetailLocationState;

  React.useEffect(() => {
    let isMounted = true;

    const loadPatient = async () => {
      if (!id) {
        setError("ID de paciente no válido");
        setLoading(false);
        return;
      }

      // Si tenemos datos del location.state, usarlos inmediatamente
      if (state?.patient) {
        setPatient(state.patient);
        setLoading(false);
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
          setError(err instanceof Error ? err.message : "Error al cargar el paciente");
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

  const handleNewSession = () => {
    navigate(ROUTES.SESSION_NEW.replace(':id', id || ''));
  };

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

      <div className="relative mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <PatientDetailHeader
          patient={patientDetail}
          onBack={() => navigate(ROUTES.PATIENTS)}
        >
          {activeTabId === "sesiones" && (
            <Button
              onClick={handleNewSession}
              className="rounded-xl bg-[var(--brand-secundario)] hover:bg-[var(--brand-secundario)]/90 text-white"
            >
              <Plus className="size-4" />
              Nueva sesión
            </Button>
          )}
        </PatientDetailHeader>
        <PatientDetailTabs 
          patient={patientDetail} 
          onActiveTabChange={setActiveTabId}
        />
      </div>
    </div>
  );
};

export default PatientDetail;

