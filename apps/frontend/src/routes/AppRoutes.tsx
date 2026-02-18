import React from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import ProtectedRoute from "./ProtectedRoute"
import PublicRoute from "./PublicRoute"

import ProtectedLayout from "@/components/layout/ProtectedRouteLayout"

import Login from "@/pages/Login"
import Register from "@/pages/Register"

import Dashboard from "@/pages/Dashboard"
import PatientsList from "@/pages/PatientsList"
import PatientDetail from "@/pages/PatientDetail"
import SessionNew from "@/pages/SessionNew"
import Profile from "@/pages/Profile"
import SummaryGenerate from "@/pages/SummaryGenerate"


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

          {/* Gestión de Pacientes */}
          <Route path="/patients" element={<PatientsList />} />
          <Route path="/patients/:id" element={<PatientDetail />} />

          {/* Sesiones Clínicas */}
          <Route path="/patients/:id/sessions/new" element={<SessionNew />} />

          {/* Resúmenes Clínicos (IA) */}
          <Route path="/patients/:id/summaries/generate" element={<SummaryGenerate />} />

          {/* Perfil del Psicólogo */}
          <Route path="/profile" element={<Profile />} />

        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default AppRoutes
