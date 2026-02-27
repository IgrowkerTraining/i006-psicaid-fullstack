import { API_ENDPOINTS } from "@/constants/routes";
import { storage } from "@/utils/storage";

export type CreateTreatmentDto = {
  content: string;
  date: string;
};

export type Treatment = {
  id?: number | string;
  patientId?: number;
  content: string;
  date: string;
  createdAt?: string;
  updatedAt?: string;
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

const normalizeTreatment = (value: unknown): Treatment | null => {
  if (!value || typeof value !== "object") {
    return null;
  }

  const treatment = value as Record<string, unknown>;
  const content = treatment.content;
  const date = treatment.date;

  if (typeof content !== "string" || typeof date !== "string") {
    return null;
  }

  return {
    id:
      typeof treatment.id === "number" || typeof treatment.id === "string"
        ? treatment.id
        : undefined,
    patientId: typeof treatment.patientId === "number" ? treatment.patientId : undefined,
    content,
    date,
    createdAt: typeof treatment.createdAt === "string" ? treatment.createdAt : undefined,
    updatedAt: typeof treatment.updatedAt === "string" ? treatment.updatedAt : undefined,
  };
};

export const treatmentsService = {
  async getPatientTreatments(patientId: string | number): Promise<Treatment[]> {
    const res = await fetch(
      `${API_ENDPOINTS.BASE}${API_ENDPOINTS.TREATMENTS.LIST(String(patientId))}`,
      { headers: getAuthHeaders() }
    );

    if (!res.ok) {
      throw new Error(await getErrorMessage(res, "No se pudieron obtener los tratamientos"));
    }

    try {
      const text = await res.text();
      if (!text || text.trim() === "") {
        return [];
      }

      const parsed = JSON.parse(text);
      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed
        .map(normalizeTreatment)
        .filter((treatment): treatment is Treatment => treatment !== null);
    } catch {
      return [];
    }
  },

  async createTreatment(
    patientId: string | number,
    payload: CreateTreatmentDto
  ): Promise<Treatment> {
    const res = await fetch(
      `${API_ENDPOINTS.BASE}${API_ENDPOINTS.TREATMENTS.CREATE(String(patientId))}`,
      {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      throw new Error(await getErrorMessage(res, "No se pudo crear el tratamiento"));
    }

    try {
      const text = await res.text();
      if (!text || text.trim() === "") {
        return payload;
      }

      const parsed = normalizeTreatment(JSON.parse(text));
      return parsed ?? payload;
    } catch {
      return payload;
    }
  },
};
