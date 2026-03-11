import React from "react"
import { Link, useNavigate } from "react-router-dom"

import { AuthSplitLayout } from "@/components/shared/auth/AuthSplitLayout"
import {
  RegisterForm,
  type RegisterSubmitPayload,
} from "@/components/shared/auth/RegisterForm"
import { useAuth } from "@/hooks/useAuth"
import { api } from "@/services/api"

const Register: React.FC = () => {
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleRegisterSubmit = async (payload: RegisterSubmitPayload) => {
    const response = await api.register(payload)
    login(response.user, response.token)
    navigate("/dashboard")
  }

  return (
    <AuthSplitLayout
      eyebrow=""
      description="Ingresa tus datos para crear tu cuenta"
      footer={
        <>
          ¿Tienes una cuenta creada?{" "}
          <Link
            to="/login"
            className="font-semibold text-brand-primario hover:text-brand-hover-primario"
          >
            Ingresa aquí
          </Link>
        </>
      }
    >
      <RegisterForm onSubmit={handleRegisterSubmit} />
    </AuthSplitLayout>
  )
}

export default Register
