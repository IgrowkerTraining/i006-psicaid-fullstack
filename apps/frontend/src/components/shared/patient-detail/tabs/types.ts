import type { PatientDetailViewModel } from "../types";

export type TabId = "ficha" | "historia" | "sesiones" | "resumen";

export type PatientTabPanelProps = {
  patient: PatientDetailViewModel;
};

export type SessionStatus = PatientDetailViewModel["sessions"][number]["status"];

