export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username?: string;
  name?: string;
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export enum AuthView {
  LOGIN = "LOGIN",
  REGISTER = "REGISTER",
  DASHBOARD = "DASHBOARD",
}

export interface Patient {
  id?: string | number
  firstName: string
  lastName: string
  birthDate: string
  occupation: string
  maritalStatus: string
  sex: string
}
