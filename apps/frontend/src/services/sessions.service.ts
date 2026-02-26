import { API_ENDPOINTS } from "@/constants/routes";
import { storage } from "@/utils/storage";

export type CreateSessionDto = {
  sessionDateTime: string; // ISO 8601 format
  sessionType?: string;
  frequency?: string; // Semanal, quincenal, mensual
  duration?: number;
  observations?: string;
  hypothesis?: string;
  interventions?: string;
  clinicalEvolution?: string;
  therapeuticGoals?: string;
  diagnosticNotes?: string;
  summary?: string; // Resumen generado por IA
};

export type UpdateSessionDto = Partial<CreateSessionDto>;

export type ClinicalSession = CreateSessionDto & {
  id: number;
  patientId: number;
  createdAt: string;
  updatedAt: string;
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
  } catch {
    // Ignore JSON parsing errors and use fallback.
  }

  return fallback;
};

export const sessionsService = {
  async getPatientSessions(patientId: string | number): Promise<ClinicalSession[]> {
    const res = await fetch(
      `${API_ENDPOINTS.BASE}${API_ENDPOINTS.SESSIONS.LIST(String(patientId))}`,
      { headers: getAuthHeaders() }
    );
    if (!res.ok) {
      throw new Error(await getErrorMessage(res, "No se pudieron obtener las sesiones"));
    }
    
    // Manejar respuesta vacía o sin JSON válido
    try {
      const text = await res.text();
      if (!text || text.trim() === '') {
        return [];
      }
      return JSON.parse(text);
    } catch (parseError) {
      console.warn('No se pudo parsear la respuesta del backend al obtener sesiones');
      return [];
    }
  },

  async createSession(
    patientId: string | number,
    payload: CreateSessionDto
  ): Promise<ClinicalSession> {
    const res = await fetch(
      `${API_ENDPOINTS.BASE}${API_ENDPOINTS.SESSIONS.CREATE(String(patientId))}`,
      {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ ...payload, patientId: Number(patientId) }),
      }
    );
    if (!res.ok) {
      throw new Error(await getErrorMessage(res, "No se pudo crear la sesión"));
    }
    
    // Manejar respuesta vacía o sin JSON válido
    try {
      const text = await res.text();
      if (!text || text.trim() === '') {
        // Backend devolvió 2xx pero sin body - la sesión se creó exitosamente
        return {} as ClinicalSession;
      }
      return JSON.parse(text);
    } catch (parseError) {
      // Si el parsing falla pero el status fue exitoso, considerar la operación exitosa
      console.warn('No se pudo parsear la respuesta del backend, pero la sesión fue creada');
      return {} as ClinicalSession;
    }
  },

  async updateSession(
    patientId: string | number,
    sessionId: number,
    payload: UpdateSessionDto
  ): Promise<ClinicalSession> {
    const res = await fetch(
      `${API_ENDPOINTS.BASE}${API_ENDPOINTS.SESSIONS.DETAIL(String(patientId), sessionId)}`,
      {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      }
    );
    if (!res.ok) {
      throw new Error(await getErrorMessage(res, "No se pudo actualizar la sesión"));
    }
    
    // Manejar respuesta vacía o sin JSON válido
    try {
      const text = await res.text();
      if (!text || text.trim() === '') {
        // Backend devolvió 2xx pero sin body - la sesión se actualizó exitosamente
        return {} as ClinicalSession;
      }
      return JSON.parse(text);
    } catch (parseError) {
      // Si el parsing falla pero el status fue exitoso, considerar la operación exitosa
      console.warn('No se pudo parsear la respuesta del backend, pero la sesión fue actualizada');
      return {} as ClinicalSession;
    }
  },
};
