import React from "react"
import { Link, useNavigate } from "react-router-dom"

import { AuthSplitLayout } from "@/components/shared/auth/AuthSplitLayout"
import {
  LoginForm,
  type LoginSubmitPayload,
} from "@/components/shared/auth/LoginForm"
import { useAuth } from "@/hooks/useAuth"
import { api } from "@/services/api"

const Login: React.FC = () => {
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleLoginSubmit = async (payload: LoginSubmitPayload) => {
    const response = await api.login(payload)
    login(response.user, response.token)
    navigate("/dashboard")
  }

  return (
    <AuthSplitLayout
      eyebrow=""
      description="Ingresa tus datos para iniciar sesión"
      footer={
        <>
          ¿No tienes una cuenta creada?{" "}
          <Link
            to="/register"
            className="font-semibold text-brand-primario hover:text-brand-hover-primario"
          >
            Regístrate aquí
          </Link>
        </>
      }
    >
      <LoginForm onSubmit={handleLoginSubmit} />
    </AuthSplitLayout>
  )
}

export default Login
