import * as React from "react"
import { AnimatePresence, motion } from "framer-motion"
import { CircleAlert, Lock, Mail } from "lucide-react"

import { Input } from "@/components/common/Input"
import { Button } from "@/components/common/Button"
import {
  toErrorMap,
  validateEmailOnBlur,
  validateLogin,
} from "@/utils/validation"

export type LoginSubmitPayload = {
  email: string
  password: string
}

type LoginFormProps = {
  onSubmit: (payload: LoginSubmitPayload) => Promise<void>
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

export function LoginForm({ onSubmit }: LoginFormProps) {
  const [values, setValues] = React.useState<LoginSubmitPayload>({
    email: "",
    password: "",
  })
  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [serverError, setServerError] = React.useState<string | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)

  const clearFieldError = (field: keyof LoginSubmitPayload) => {
    setErrors((previous) => {
      if (!previous[field]) {
        return previous
      }
      const next = { ...previous }
      delete next[field]
      return next
    })
  }

  const handleChange = (field: keyof LoginSubmitPayload) => {
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

    const validation = validateLogin(values)
    if (!validation.isValid) {
      setErrors(toErrorMap(validation.errors))
      return
    }

    setIsLoading(true)
    try {
      await onSubmit({
        email: values.email.trim(),
        password: values.password,
      })
    } catch (error: any) {
      setServerError(
        error?.message || "No se pudo iniciar sesión. Inténtalo otra vez."
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
      className="space-y-4"
    >
      <AnimatePresence initial={false}>
        {serverError ? (
          <motion.div
            key="server-error"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: smoothEase }}
            className="flex items-center gap-2 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-700"
          >
            <CircleAlert className="size-4" />
            {serverError}
          </motion.div>
        ) : null}
      </AnimatePresence>

      <motion.div variants={itemVariants}>
        <Input
          label="Correo electrónico"
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
          type="password"
          placeholder="********"
          value={values.password}
          onChange={handleChange("password")}
          error={errors.password}
          disabled={isLoading}
          icon={<Lock className="size-4" />}
          className="border-slate-300 bg-white text-slate-900 placeholder:text-slate-400"
        />
      </motion.div>

      <motion.div variants={itemVariants}>
      <Button
        type="submit"
        className="mt-2 h-11 w-full rounded-md bg-brand-secundario text-white hover:bg-brand-secundario/90"
        isLoading={isLoading}
        loadingText="Iniciando sesión..."
      >
          Iniciar sesión
        </Button>
      </motion.div>
    </motion.form>
  )
}
