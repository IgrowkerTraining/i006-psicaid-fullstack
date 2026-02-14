export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  HOME: '/',
} as const;

export const API_ENDPOINTS = {
  BASE: 'http://localhost:3000/api',
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
  },
} as const;

export const STORAGE_KEYS = {
  USER: 'user',
  TOKEN: 'access_token',
} as const;

export const ASSETS = {
  S3_BUCKET_BASE_URL: "https://psicaid-static-resources-bucket.s3.eu-south-2.amazonaws.com/",

  IMAGES: {
    LOGO: "isotipo_psicaid+2.png",
  },
} as const;
