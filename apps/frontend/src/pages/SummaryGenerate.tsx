import React from "react";
import { Navigate, useParams } from "react-router-dom";

import { ROUTES } from "@/constants/routes";
import type { TabId } from "@/components/shared/patient-detail/tabs";

const SUMMARY_TAB_ID: TabId = "resumen";

const SummaryGenerate: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return <Navigate to={ROUTES.PATIENTS} replace />;
  }

  return (
    <Navigate
      to={ROUTES.PATIENT_DETAIL.replace(":id", id)}
      replace
      state={{
        initialTab: SUMMARY_TAB_ID,
        openGenerateSummary: true,
      }}
    />
  );
};

export default SummaryGenerate;
