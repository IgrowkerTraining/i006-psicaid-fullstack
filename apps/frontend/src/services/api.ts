import { User } from "../types";
import { API_ENDPOINTS } from "../constants/routes";

// Tipo de respuesta del backend (ProfessionalDTO)
type BackendUser = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

type AuthResponse = {
  user: BackendUser;
  token: string;
  message: string;
}

// Mapea el usuario del backend al formato del frontend
function mapBackendUser(backendUser: BackendUser): User {
  return {
    id: backendUser.id.toString(),
    email: backendUser.email,
    firstName: backendUser.firstName,
    lastName: backendUser.lastName,
    username: `${backendUser.firstName.toLowerCase()}${backendUser.lastName.toLowerCase()}`,
    name: `${backendUser.firstName} ${backendUser.lastName}`,
  };
}

export const api = {
  async register(data: { firstName: string, lastName: string, email: string, password: string }): Promise<{ user: User; token:string; message: string }> {
    const response = await fetch(
      `${API_ENDPOINTS.BASE}${API_ENDPOINTS.AUTH.REGISTER}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      },
    );

    const result: AuthResponse = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Registration failed");
    }
    return {
      user: mapBackendUser(result.user),
      token: result.token,
      message: result.message,
    };
  },

  async login(
    data: {email: string, password:string},
  ): Promise<{ user: User; token: string; message: string }> {
    const response = await fetch(
      `${API_ENDPOINTS.BASE}${API_ENDPOINTS.AUTH.LOGIN}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      },
    );

    const result: AuthResponse = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Login failed");
    }
    return {
      user: mapBackendUser(result.user),
      token: result.token,
      message: result.message,
    };
  },
};
