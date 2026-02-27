import * as React from "react"
import { AnimatePresence, motion } from "framer-motion"
import { AlertCircle, Eye, EyeOff, Lock, Mail, UserRound } from "lucide-react"

import { Input } from "@/components/common/Input"
import { Button } from "@/components/common/Button"
import {
  toErrorMap,
  validateEmailOnBlur,
  validateRegistration,
} from "@/utils/validation"

type RegisterFormValues = {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
}

export type RegisterSubmitPayload = {
  firstName: string
  lastName: string
  email: string
  password: string
}

type RegisterFormProps = {
  onSubmit: (payload: RegisterSubmitPayload) => Promise<void>
}

const initialValues: RegisterFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
}

const smoothEase: [number, number, number, number] = [0.22, 1, 0.36, 1]

const formVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: smoothEase,
      delayChildren: 0.05,
      staggerChildren: 0.07,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: smoothEase },
  },
}

export function RegisterForm({ onSubmit }: RegisterFormProps) {
  const [values, setValues] = React.useState<RegisterFormValues>(initialValues)
  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)
  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [serverError, setServerError] = React.useState<string | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)

  const clearFieldError = (field: keyof RegisterFormValues) => {
    setErrors((previous) => {
      if (!previous[field]) {
        return previous
      }
      const next = { ...previous }
      delete next[field]
      return next
    })
  }

  const handleChange = (field: keyof RegisterFormValues) => {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues((previous) => ({
        ...previous,
        [field]: event.target.value,
      }))
      clearFieldError(field)
      setServerError(null)
    }
  }

  const handleEmailBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const emailError = validateEmailOnBlur(event.target.value)
    setErrors((previous) => {
      const next = { ...previous }
      if (emailError) {
        next.email = emailError
      } else {
        delete next.email
      }
      return next
    })
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setServerError(null)

    const validation = validateRegistration(values)
    if (!validation.isValid) {
      setErrors(toErrorMap(validation.errors))
      return
    }

    setIsLoading(true)
    try {
      await onSubmit({
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        email: values.email.trim(),
        password: values.password,
      })
    } catch (error: any) {
      setServerError(
        error?.message || "Ha ocurrido un error en el registro. Inténtalo nuevamente."
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      noValidate
      variants={formVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 gap-4"
    >
      <AnimatePresence initial={false}>
        {serverError ? (
          <motion.div
            key="server-error"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: smoothEase }}
            className="col-span-full flex items-center gap-2 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-700"
          >
            <AlertCircle className="size-4" />
            {serverError}
          </motion.div>
        ) : null}
      </AnimatePresence>

      <motion.div variants={itemVariants}>
        <Input
          label="Nombre"
          name="firstName"
          placeholder="Julián"
          value={values.firstName}
          onChange={handleChange("firstName")}
          error={errors.firstName}
          disabled={isLoading}
          icon={<UserRound className="size-4" />}
          className="border-slate-300 bg-white text-slate-900 placeholder:text-slate-400"
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <Input
          label="Apellido"
          name="lastName"
          placeholder="Martínez"
          value={values.lastName}
          onChange={handleChange("lastName")}
          error={errors.lastName}
          disabled={isLoading}
          icon={<UserRound className="size-4" />}
          className="border-slate-300 bg-white text-slate-900 placeholder:text-slate-400"
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <Input
          label="Correo electrónico"
          name="email"
          type="email"
          placeholder="julian@email.com"
          value={values.email}
          onChange={handleChange("email")}
          onBlur={handleEmailBlur}
          error={errors.email}
          disabled={isLoading}
          icon={<Mail className="size-4" />}
          className="border-slate-300 bg-white text-slate-900 placeholder:text-slate-400"
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <Input
          label="Contraseña"
          name="password"
          type={showPassword ? "text" : "password"}
          placeholder="********"
          value={values.password}
          onChange={handleChange("password")}
          error={errors.password}
          disabled={isLoading}
          icon={<Lock className="size-4" />}
          endIcon={
            showPassword ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )
          }
          endIconAriaLabel={
            showPassword ? "Ocultar contrasena" : "Mostrar contrasena"
          }
          onEndIconClick={() => setShowPassword((previous) => !previous)}
          className="border-slate-300 bg-white text-slate-900 placeholder:text-slate-400"
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <Input
          label="Confirmar contraseña"
          name="confirmPassword"
          type={showConfirmPassword ? "text" : "password"}
          placeholder="********"
          value={values.confirmPassword}
          onChange={handleChange("confirmPassword")}
          error={errors.confirmPassword}
          disabled={isLoading}
          icon={<Lock className="size-4" />}
          endIcon={
            showConfirmPassword ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )
          }
          endIconAriaLabel={
            showConfirmPassword
              ? "Ocultar confirmacion de contrasena"
              : "Mostrar confirmacion de contrasena"
          }
          onEndIconClick={() =>
            setShowConfirmPassword((previous) => !previous)
          }
          className="border-slate-300 bg-white text-slate-900 placeholder:text-slate-400"
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <Button
          type="submit"
          className="h-11 w-full rounded-md bg-brand-primario text-white hover:bg-brand-hover-primario"
          isLoading={isLoading}
          loadingText="Registrando..."
        >
          Registrarse
        </Button>
      </motion.div>
    </motion.form>
  )
}
