import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import PatientDetailHeader from "@/components/shared/patient-detail/PatientDetailHeader";
import PatientDetailTabs from "@/components/shared/patient-detail/PatientDetailTabs";
import { buildPatientDetailMock } from "@/components/shared/patient-detail/mockPatientDetail";
import { ROUTES } from "@/constants/routes";
import type { Patient } from "@/services/patients.service";

type PatientDetailLocationState = {
  patient?: Patient;
} | null;

const PatientDetail: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();

  const state = (location.state ?? null) as PatientDetailLocationState;
  const patientFromState = state?.patient ?? null;

  const patientDetail = React.useMemo(
    () => buildPatientDetailMock(patientFromState, id),
    [patientFromState, id]
  );

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
        />
        <PatientDetailTabs patient={patientDetail} />
      </div>
  );
};

export default PatientDetail;

