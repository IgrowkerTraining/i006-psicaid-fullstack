import React, { createContext, useContext, useReducer, useEffect } from "react";
import { api } from "../services/api";
import { AuthState, User } from "../types";
import { storage } from "../utils/storage";

interface AuthContextType {
  authState: AuthState;
  login: (user: User, token: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

type AuthAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_USER"; payload: User }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "LOGOUT" };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_USER":
      return {
        user: action.payload,
        isAuthenticated: true,
        loading: false,
        error: null,
      };
    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case "LOGOUT":
      return {
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      };
    default:
      return state;
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [authState, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let isMounted = true;

    const validateSession = async () => {
      const savedToken = storage.getToken();

      if (!savedToken) {
        if (isMounted) {
          dispatch({ type: "SET_LOADING", payload: false });
        }
        return;
      }

      try {
        const user = await api.getCurrentUser(savedToken);

        // Conserva compatibilidad con campos opcionales usados por el frontend.
        const normalizedUser: User = {
          ...user,
          name: user.name ?? `${user.firstName} ${user.lastName}`.trim(),
          username:
            user.username ??
            `${user.firstName.toLowerCase()}${user.lastName.toLowerCase()}`,
        };

        storage.setUser(normalizedUser);

        if (isMounted) {
          dispatch({ type: "SET_USER", payload: normalizedUser });
        }
      } catch (error) {
        console.warn("Sesión inválida o expirada. Cerrando sesión.", error);
        storage.clear();

        if (isMounted) {
          dispatch({ type: "LOGOUT" });
        }
      }
    };

    void validateSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = (user: User, token: string) => {
    storage.setUser(user);
    storage.setToken(token);
    dispatch({ type: "SET_USER", payload: user });
  };

  const logout = () => {
    storage.clear();
    dispatch({ type: "LOGOUT" });
  };

  const setLoading = (loading: boolean) => {
    dispatch({ type: "SET_LOADING", payload: loading });
  };

  const setError = (error: string | null) => {
    dispatch({ type: "SET_ERROR", payload: error });
  };

  return (
    <AuthContext.Provider
      value={{
        authState,
        login,
        logout,
        setLoading,
        setError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};
