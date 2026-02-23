export const ROUTES = {
  // Rutas públicas
  LOGIN: '/login',
  REGISTER: '/register',
  ROOT: '/',
  
  // Rutas privadas
  DASHBOARD: '/dashboard',
  AGENDA: '/agenda',
  
  // Pacientes
  PATIENTS: '/patients',
  PATIENTS_LIST: '/patients',
  PATIENTS_NEW: '/patients/new',
  PATIENTS_SEARCH: '/patients/search',
  PATIENT_DETAIL: '/patients/:id',
  
  // Secciones del paciente (pestañas dentro del detalle del paciente)
  PATIENT_INFO: '/patients/:id/info',
  PATIENT_SESSIONS: '/patients/:id/sessions',
  PATIENT_DIAGNOSES: '/patients/:id/diagnoses',
  PATIENT_SUMMARIES: '/patients/:id/summaries',
  
  // Sesiones
  SESSION_NEW: '/patients/:id/sessions/new',
  SESSION_DETAIL: '/patients/:id/sessions/:sessionId',
  
  // Diagnósticos
  DIAGNOSIS_NEW: '/patients/:id/diagnoses/new',
  
  // Resúmenes IA
  SUMMARY_GENERATE: '/patients/:id/summaries/generate',
  SUMMARY_DETAIL: '/patients/:id/summaries/:summaryId',
  SUMMARIES_HISTORY: '/patients/:id/summaries/history',
  
  // Perfil del usuario y configuración
  PROFILE: '/profile',
  SETTINGS: '/settings',
  SECURITY: '/settings/security',
} as const;

export const API_ENDPOINTS = {
  BASE: 'http://localhost:3000/api',
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
  },
  PATIENTS: {
    LIST: '/patients',
    CREATE: '/patients',
    DETAIL: (id: string) => `/patients/${id}`,
  }
} as const;

export const STORAGE_KEYS = {
  USER: 'user',
  TOKEN: 'access_token',
} as const;

export const ASSETS = {
  S3_BUCKET_BASE_URL: "https://d2oi3ate4vb1sl.cloudfront.net/",

  IMAGES: {
    LOGO: "isotipo_psicaid+2.png",
    AUTH_IMAGE: "login-sigup-image.webp"
  },
} as const;
