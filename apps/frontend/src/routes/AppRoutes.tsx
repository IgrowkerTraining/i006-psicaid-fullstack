import React from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import ProtectedRoute from "./ProtectedRoute"
import PublicRoute from "./PublicRoute"

import Login from "../pages/Login"
import Register from "../pages/Register"
import Dashboard from "../pages/Dashboard"
import ProtectedLayout from "@/components/layout/ProtectedRouteLayout"

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Rutas Publicas van en este Bloque */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Rutas que requieran al usuario autenticado van en este Bloque */}
      <Route element={<ProtectedRoute />}>
        <Route element={<ProtectedLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default AppRoutes
