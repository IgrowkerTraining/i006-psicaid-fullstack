import type { PatientDetailViewModel } from "../types";
import type {
  HistoricalSummaryResponse,
  HistoricalSummariesPageResponse,
} from "@/services/ai-summaries.service";

export type TabId = "ficha" | "tratamientos" | "sesiones" | "resumen";

export type PatientTabPanelProps = {
  patient: PatientDetailViewModel;
  onOpenGenerateSummary?: () => void;
  summaries?: HistoricalSummaryResponse[];
  summariesPage?: Pick<
    HistoricalSummariesPageResponse,
    "number" | "totalPages" | "totalElements" | "first" | "last"
  > | null;
  summariesLoading?: boolean;
  summariesError?: string | null;
  onSummaryPageChange?: (page: number) => void;
};

export type SessionStatus = PatientDetailViewModel["sessions"][number]["status"];
