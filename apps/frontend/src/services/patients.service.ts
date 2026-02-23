import { API_ENDPOINTS } from "@/constants/routes";
import { storage } from "@/utils/storage";

export type CreatePatientDto = {
  firstName: string;
  lastName: string;
  birthDate: string;
  occupation: string;
  maritalStatus: string;
  sex: string;
};

export type UpdatePatientDto = CreatePatientDto;

export type Patient = CreatePatientDto & {
  id: string | number;
  active?: boolean | string;
};

const getAuthHeaders = () =>{
  const token = storage.getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? {Authorization: `Bearer ${token}`} : {}),
  };
}

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

export const patientsService = {
  async list(): Promise<Patient[]> {
    const res = await fetch(`${API_ENDPOINTS.BASE}${API_ENDPOINTS.PATIENTS.LIST}`,{
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error(await getErrorMessage(res, "No se pudieron obtener pacientes"));
    return res.json();
  },

  async create(payload: CreatePatientDto): Promise<Patient> {
    const res = await fetch(`${API_ENDPOINTS.BASE}${API_ENDPOINTS.PATIENTS.CREATE}`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(await getErrorMessage(res, "No se pudo crear el paciente"));
    return res.json();
  },

  async update(id: string, payload: UpdatePatientDto): Promise<void> {
    const res = await fetch(`${API_ENDPOINTS.BASE}${API_ENDPOINTS.PATIENTS.DETAIL(id)}`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(await getErrorMessage(res, "No se pudo actualizar el paciente"));
    }
  },

  async deactivate(id: string): Promise<void> {
    const res = await fetch(`${API_ENDPOINTS.BASE}${API_ENDPOINTS.PATIENTS.DETAIL(id)}`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify({ active: "false" }),
    });

    if (!res.ok) {
      throw new Error(await getErrorMessage(res, "No se pudo desactivar el paciente"));
    }
  },
};
