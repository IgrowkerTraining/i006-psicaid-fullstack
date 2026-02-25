import { API_ENDPOINTS } from "@/constants/routes";
import { storage } from "@/utils/storage";

export type CreatePatientDto = {
  firstName: string;
  lastName: string;
  birthDate: string;
  occupation: string;
  maritalStatus: string;
  sex: string;
  email?: string;
  phone?: string;
  reasonConsultation?: string;
};

export type UpdatePatientDto = CreatePatientDto;

export type Patient = CreatePatientDto & {
  id: string | number;
  active?: boolean | string;
  reason_consultation?: string; // Backend devuelve snake_case
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

  async getById(id: string): Promise<Patient> {
    const res = await fetch(`${API_ENDPOINTS.BASE}${API_ENDPOINTS.PATIENTS.DETAIL(id)}`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error(await getErrorMessage(res, "No se pudo obtener el paciente"));
    return res.json();
  },

  async create(payload: CreatePatientDto): Promise<Patient> {
    // Transformar camelCase a snake_case para reason_consultation
    const backendPayload: any = {
      firstName: payload.firstName,
      lastName: payload.lastName,
      birthDate: payload.birthDate,
      occupation: payload.occupation,
      maritalStatus: payload.maritalStatus,
      sex: payload.sex,
      email: payload.email,
      phone: payload.phone,
      reason_consultation: payload.reasonConsultation, // Backend espera snake_case
    };

    const res = await fetch(`${API_ENDPOINTS.BASE}${API_ENDPOINTS.PATIENTS.CREATE}`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(backendPayload),
    });
    if (!res.ok) throw new Error(await getErrorMessage(res, "No se pudo crear el paciente"));
    return res.json();
  },

  async update(id: string, payload: UpdatePatientDto): Promise<void> {
    // TODO BACKEND: Hay un error JDBC al actualizar pacientes:
    // "prepared statement S_4 already exists" - revisar conexiones/transacciones
    
    // Transformar camelCase a snake_case para reason_consultation
    const backendPayload: any = {
      firstName: payload.firstName,
      lastName: payload.lastName,
      birthDate: payload.birthDate,
      occupation: payload.occupation,
      maritalStatus: payload.maritalStatus,
      sex: payload.sex,
      email: payload.email,
      phone: payload.phone,
      reason_consultation: payload.reasonConsultation, // Backend espera snake_case
    };

    const res = await fetch(`${API_ENDPOINTS.BASE}${API_ENDPOINTS.PATIENTS.DETAIL(id)}`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify(backendPayload),
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
