import React from "react"
import { Navigate, Route, Routes } from "react-router-dom"

import ProtectedLayout from "@/components/layout/ProtectedRouteLayout"
import { ROUTES } from "@/constants/routes"
import Agenda from "@/pages/Agenda"
import Dashboard from "@/pages/Dashboard"
import Error404 from "@/pages/Error404"
import Home from "@/pages/Home"
import Login from "@/pages/Login"
import PatientDetail from "@/pages/PatientDetail"
import PatientsList from "@/pages/PatientsList"
import Profile from "@/pages/Profile"
import Register from "@/pages/Register"
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
          <Route path={ROUTES.AGENDA} element={<Agenda />} />
          <Route path={ROUTES.PATIENTS} element={<PatientsList />} />
          <Route path={ROUTES.PATIENT_DETAIL} element={<PatientDetail />} />
          <Route path={ROUTES.SUMMARY_GENERATE} element={<SummaryGenerate />} />
          <Route path={ROUTES.PROFILE} element={<Profile />} />
          <Route path={ROUTES.SETTINGS} element={<Settings />} />
        </Route>
      </Route>

      <Route path="*" element={<Error404 />} />
    </Routes>
  )
}

export default AppRoutes
