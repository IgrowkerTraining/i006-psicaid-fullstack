import React from "react"
import { Outlet } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { Header } from "./Header"
import { Sidebar } from "./Sidebar"
import { Home, Settings, User } from "lucide-react"

export const ProtectedLayout: React.FC = () => {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-200">
      <div className="hidden md:block">
        <Sidebar
          items={[
            { label: "Inicio", path: "/dashboard", icon: <Home/> },
            { label: "Pacientes", path: "/patients", icon: <User /> },
            { label: "Configuración", path: "/settings", icon: <Settings /> },
          ]}
          activePath={location.hash.replace("#", "")}
          onNavigate={(path) => (window.location.hash = path)}
        />
      </div>

      {/* Contenido principal de cada vista bajo el layout de ruta protegida */}
      <div className="flex-1 min-w-0">
        <Header
          user={{ name: user?.name ?? "Usuario", avatar: user?.avatar }}
          onLogout={logout}
        />

        <main className="px-6 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default ProtectedLayout
