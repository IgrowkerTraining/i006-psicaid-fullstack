import React from "react"
import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import { LoadingSpinner } from "../components/layout/LoadingSpinner"

interface ProtectedRouteProps {
  children?: React.ReactNode
  redirectTo?: string
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectTo = "/login",
}) => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <LoadingSpinner message="Cargando..." />
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />
  }
  return children ? <>{children}</> : <Outlet />
}

export default ProtectedRoute
