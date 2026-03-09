import { API_ENDPOINTS } from "@/constants/routes";
import { storage } from "@/utils/storage";

export type SessionSummaryResponse = {
  summary: string;
};

export type GenerateHistoricalSummaryPayload = {
  dateFrom: string;
  dateUntil: string;
};

export type HistoricalSummaryResponse = {
  id: number;
  content: string;
  dateFrom: string;
  dateUntil: string;
  generatedAt: string;
  patientId: number;
};

const getAuthHeaders = () => {
  const token = storage.getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const getErrorMessage = async (response: Response, fallback: string) => {
  try {
    const body = await response.json();
    if (body?.message && typeof body.message === "string") {
      return body.message;
    }
    if (body?.error && typeof body.error === "string") {
      return body.error;
    }
  } catch {
    // Ignore JSON parsing errors and use fallback.
  }

  return fallback;
};

export const aiSummariesService = {
  async generateSessionSummary(
    patientId: string | number,
    sessionId: number
  ): Promise<SessionSummaryResponse> {
    const res = await fetch(
      `${API_ENDPOINTS.BASE}${API_ENDPOINTS.SESSIONS.SUMMARIZE(String(patientId), sessionId)}`,
      {
        method: "POST",
        headers: getAuthHeaders(),
      }
    );

    if (!res.ok) {
      throw new Error(await getErrorMessage(res, "No se pudo generar el resumen de la sesion"));
    }

    try {
      const text = await res.text();
      if (!text || text.trim() === "") {
        return { summary: "" };
      }
      return JSON.parse(text) as SessionSummaryResponse;
    } catch {
      return { summary: "" };
    }
  },

  async generateHistoricalSummary(
    patientId: string | number,
    payload: GenerateHistoricalSummaryPayload
  ): Promise<HistoricalSummaryResponse> {
    const res = await fetch(
      `${API_ENDPOINTS.BASE}${API_ENDPOINTS.SUMMARIES.GENERATE_HISTORICAL(String(patientId))}`,
      {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      throw new Error(await getErrorMessage(res, "No se pudo generar el resumen historico"));
    }

    const text = await res.text();
    if (!text || text.trim() === "") {
      throw new Error("El backend no devolvio contenido del resumen historico");
    }

    return JSON.parse(text) as HistoricalSummaryResponse;
  },
};

