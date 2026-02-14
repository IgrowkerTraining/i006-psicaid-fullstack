import { User } from "../types";
import { API_ENDPOINTS } from "../constants/routes";

export const api = {
  async register(data: { name: string, email: string, password: string }): Promise<{ user: User; token:string; message: string }> {
    const response = await fetch(
      `${API_ENDPOINTS.BASE}${API_ENDPOINTS.AUTH.REGISTER}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      },
    );

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || "Registration failed");
    }
    return result;
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

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || "Login failed");
    }
    return result;
  },
};
