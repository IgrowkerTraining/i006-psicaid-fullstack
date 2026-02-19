import React from "react"
import { Navigate, Route, Routes } from "react-router-dom"

import ProtectedLayout from "@/components/layout/ProtectedRouteLayout"
import { ROUTES } from "@/constants/routes"
import Dashboard from "@/pages/Dashboard"
import Home from "@/pages/Home"
import Login from "@/pages/Login"
import PatientDetail from "@/pages/PatientDetail"
import PatientsList from "@/pages/PatientsList"
import Profile from "@/pages/Profile"
import Register from "@/pages/Register"
import SessionNew from "@/pages/SessionNew"
import Settings from "@/pages/Settings"
import SummaryGenerate from "@/pages/SummaryGenerate"

import ProtectedRoute from "./ProtectedRoute"
import PublicRoute from "./PublicRoute"

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path={ROUTES.ROOT} element={<Home />} />

      <Route element={<PublicRoute />}>
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.REGISTER} element={<Register />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<ProtectedLayout />}>
          <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
          <Route path={ROUTES.PATIENTS} element={<PatientsList />} />
          <Route path={ROUTES.PATIENT_DETAIL} element={<PatientDetail />} />
          <Route path={ROUTES.SESSION_NEW} element={<SessionNew />} />
          <Route path={ROUTES.SUMMARY_GENERATE} element={<SummaryGenerate />} />
          <Route path={ROUTES.PROFILE} element={<Profile />} />
          <Route path={ROUTES.SETTINGS} element={<Settings />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to={ROUTES.ROOT} replace />} />
    </Routes>
  )
}

export default AppRoutes
