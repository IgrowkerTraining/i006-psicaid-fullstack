export interface ValidationError {
  field: string
  message: string
}

export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
}

type RegistrationValidationData = {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword?: string
}

type LoginValidationData = {
  email: string
  password: string
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PASSWORD_COMPLEXITY_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/

export const validateEmail = (email: string): string | null => {
  if (!EMAIL_REGEX.test(email.trim())) {
    return "Ingresa un correo electronico valido."
  }
  return null
}

export const validateRequired = (
  value: string,
  fieldName: string
): string | null => {
  if (!value || value.trim() === "") {
    return `${fieldName} es obligatorio.`
  }
  return null
}

export const validateMinLength = (
  value: string,
  min: number,
  fieldName = "Este campo"
): string | null => {
  if (value.length < min) {
    return `${fieldName} debe tener al menos ${min} caracteres.`
  }
  return null
}

export const validatePasswordStrength = (
  value: string,
  fieldName = "La contrasena"
): string[] => {
  const errors: string[] = []

  if (value.length <= 8) {
    errors.push(`${fieldName} debe tener mas de 8 caracteres.`)
  }

  if (!PASSWORD_COMPLEXITY_REGEX.test(value)) {
    errors.push(
      `${fieldName} debe incluir una mayuscula, una minuscula, un numero y un caracter especial.`
    )
  }

  return errors
}

export const validateLogin = (data: LoginValidationData): ValidationResult => {
  const errors: ValidationError[] = []

  const emailValue = data.email.trim()
  const passwordValue = data.password

  const emailRequiredError = validateRequired(emailValue, "El correo electronico")
  if (emailRequiredError) {
    errors.push({ field: "email", message: emailRequiredError })
  } else {
    const emailFormatError = validateEmail(emailValue)
    if (emailFormatError) {
      errors.push({ field: "email", message: emailFormatError })
    }
  }

  const passwordError = validateRequired(passwordValue, "La contrasena")
  if (passwordError) {
    errors.push({ field: "password", message: passwordError })
  } else {
    const passwordStrengthErrors = validatePasswordStrength(passwordValue)
    passwordStrengthErrors.forEach((passwordStrengthError) => {
      errors.push({ field: "password", message: passwordStrengthError })
    })
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

export const validateRegistration = (
  data: RegistrationValidationData
): ValidationResult => {
  const errors: ValidationError[] = []

  const firstNameValue = data.firstName.trim()
  const lastNameValue = data.lastName.trim()
  const emailValue = data.email.trim()
  const passwordValue = data.password
  const confirmPasswordValue = data.confirmPassword ?? ""

  const firstNameError = validateRequired(firstNameValue, "El nombre")
  if (firstNameError) {
    errors.push({ field: "firstName", message: firstNameError })
  }

  const lastNameError = validateRequired(lastNameValue, "El apellido")
  if (lastNameError) {
    errors.push({ field: "lastName", message: lastNameError })
  }

  const emailRequiredError = validateRequired(emailValue, "El correo electronico")
  if (emailRequiredError) {
    errors.push({ field: "email", message: emailRequiredError })
  } else {
    const emailFormatError = validateEmail(emailValue)
    if (emailFormatError) {
      errors.push({ field: "email", message: emailFormatError })
    }
  }

  const passwordRequiredError = validateRequired(passwordValue, "La contrasena")
  if (passwordRequiredError) {
    errors.push({ field: "password", message: passwordRequiredError })
  } else {
    const passwordStrengthErrors = validatePasswordStrength(
      passwordValue,
      "La contrasena"
    )
    passwordStrengthErrors.forEach((passwordStrengthError) => {
      errors.push({ field: "password", message: passwordStrengthError })
    })
  }

  if (data.confirmPassword !== undefined) {
    const confirmRequiredError = validateRequired(
      confirmPasswordValue,
      "La confirmacion de contrasena"
    )
    if (confirmRequiredError) {
      errors.push({ field: "confirmPassword", message: confirmRequiredError })
    } else if (passwordValue !== confirmPasswordValue) {
      errors.push({
        field: "confirmPassword",
        message: "Las contrasenas no coinciden.",
      })
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

export const toErrorMap = (
  errors: ValidationError[]
): Record<string, string> => {
  return errors.reduce<Record<string, string>>((accumulator, error) => {
    if (accumulator[error.field]) {
      accumulator[error.field] = `${accumulator[error.field]}\n${error.message}`
    } else {
      accumulator[error.field] = error.message
    }
    return accumulator
  }, {})
}

export const validateEmailOnBlur = (value: string): string | null => {
  const emailValue = value.trim()
  if (!emailValue) {
    return null
  }
  return validateEmail(emailValue)
}
