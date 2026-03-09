import React from "react"
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import { LayoutDashboard, Settings, Users, CalendarHeart } from "lucide-react"

import { ROUTES } from "@/constants/routes"
import { useAuth } from "@/hooks/useAuth"

import { Header } from "./Header"
import { Sidebar } from "./Sidebar"

export const ProtectedLayout: React.FC = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div className="flex min-h-screen bg-[#e8ebf9] text-[var(--brand-primario)]">
      <div className="hidden md:block">
        <Sidebar
          items={[
            { label: "Inicio", path: ROUTES.DASHBOARD, icon: <LayoutDashboard size={20} /> },
            { label: "Pacientes", path: ROUTES.PATIENTS, icon: <Users size={20} /> },
            { label: "Agenda", path: ROUTES.AGENDA, icon: <CalendarHeart size={20} /> },
          ]}
          activePath={location.pathname}
          onNavigate={(path) => navigate(path)}
        />
      </div>

      <div className="min-w-0 flex-1">
        <Header
          user={{ name: user ? `${user.firstName} ${user.lastName}` : "Usuario", avatar: user?.avatar }}
          onLogout={logout}
        />

        <main className="max-w-full mx-auto w-full px-9 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default ProtectedLayout
