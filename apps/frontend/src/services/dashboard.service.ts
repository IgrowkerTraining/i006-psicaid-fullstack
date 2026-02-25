import { API_ENDPOINTS } from "@/constants/routes";
import { storage } from "@/utils/storage";
import { type ClinicalSession } from "./sessions.service";


export type { ClinicalSession };

export type UpcomingSession = {
  sessionId: number;
  patientId: number;
  patientFullName: string;
  sessionDateTime: string;
};

export type DashboardStats = {
  sessionsToday: number;
  sessionsThisWeek: number;
  totalActivePatients: number;
  sessionsThisMonth: number;
  upcomingSessions: UpcomingSession[];
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
    return body?.message || fallback;
  } catch {
    return fallback;
  }
};

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    const res = await fetch(
      `${API_ENDPOINTS.BASE}/dashboard/stats`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      }
    );
    if (!res.ok) {
      throw new Error(await getErrorMessage(res, "No se pudieron obtener las estadísticas"));
    }
    return res.json();
  },

  // TODO: Pedir a backend que agregue este endpoint:
  // GET /api/dashboard/sessions?startDate=xxx&endDate=xxx
  // Debe retornar List<ClinicalSessionDTO> con todas las sesiones del profesional
  // en el rango de fechas para mostrar en calendario/agenda.
  // También agregar campo 'patientFullName' a ClinicalSessionDTO para mostrar
  // el nombre del paciente en la vista de agenda.
};
