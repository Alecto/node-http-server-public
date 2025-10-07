import 'dotenv/config'

const parseBoolean = (value, fallback) => {
  if (value === undefined || value === null) return fallback
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase()
    if (normalized === 'true') return true
    if (normalized === 'false') return false
  }
  return Boolean(value)
}

const parseInteger = (value, fallback) => {
  const numeric = Number(value)
  return Number.isFinite(numeric) && numeric > 0 ? Math.floor(numeric) : fallback
}

// Auth0 конфігурація
export const AUTH0_CONFIG = {
  ISSUER_BASE_URL: process.env.AUTH0_ISSUER_BASE_URL || '',
  CLIENT_ID: process.env.AUTH0_CLIENT_ID || '',
  CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET || '',
  BASE_URL: process.env.AUTH0_BASE_URL || 'http://localhost:3000',
  SECRET: process.env.AUTH0_SECRET || 'default-secret-change-in-production',
  ENABLED: parseBoolean(process.env.AUTH0_ENABLED, true)
}

// JWT конфігурація
export const JWT_CONFIG = {
  SECRET: process.env.JWT_SECRET || 'jwt-secret-change-in-production',
  EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  ALGORITHM: 'HS256'
}

// Session конфігурація
export const SESSION_CONFIG = {
  SECRET: process.env.SESSION_SECRET || 'session-secret-change-in-production',
  MAX_AGE: parseInteger(process.env.SESSION_MAX_AGE, 86400000), // 24 години за замовчуванням
  COOKIE_NAME: 'connect.sid',
  RESAVE: false,
  SAVE_UNINITIALIZED: false
}

// Auth0 OpenID Connect конфігурація
export const getAuth0Config = () => {
  return {
    authRequired: false, // Не всі роути вимагають автентифікації
    auth0Logout: true,
    secret: AUTH0_CONFIG.SECRET,
    baseURL: AUTH0_CONFIG.BASE_URL,
    clientID: AUTH0_CONFIG.CLIENT_ID,
    issuerBaseURL: AUTH0_CONFIG.ISSUER_BASE_URL,
    clientSecret: AUTH0_CONFIG.CLIENT_SECRET,
    authorizationParams: {
      response_type: 'code',
      scope: 'openid profile email'
    },
    routes: {
      login: '/auth/login',
      logout: '/auth/logout',
      callback: '/auth/callback'
    }
    // Примітка: express-openid-connect використовує власні налаштування session
    // і не дозволяє перевизначати session.cookie напряму
  }
}

// Перевірка наявності обов'язкових змінних
export const validateAuthConfig = () => {
  if (!AUTH0_CONFIG.ENABLED) {
    return { valid: true, warnings: ['Auth0 вимкнено'] }
  }

  const errors = []
  const warnings = []
  const isProduction = process.env.NODE_ENV === 'production'

  if (!AUTH0_CONFIG.ISSUER_BASE_URL) {
    errors.push('AUTH0_ISSUER_BASE_URL не налаштовано')
  }

  if (!AUTH0_CONFIG.CLIENT_ID) {
    errors.push('AUTH0_CLIENT_ID не налаштовано')
  }

  if (!AUTH0_CONFIG.CLIENT_SECRET) {
    errors.push('AUTH0_CLIENT_SECRET не налаштовано')
  }

  // Критичні перевірки для продакшну
  if (isProduction) {
    if (AUTH0_CONFIG.SECRET === 'default-secret-change-in-production') {
      errors.push('AUTH0_SECRET повинен бути змінений для продакшну')
    }

    if (AUTH0_CONFIG.SECRET.length < 32) {
      errors.push('AUTH0_SECRET повинен містити мінімум 32 символи')
    }

    if (JWT_CONFIG.SECRET === 'jwt-secret-change-in-production') {
      errors.push('JWT_SECRET повинен бути змінений для продакшну')
    }

    if (JWT_CONFIG.SECRET.length < 32) {
      errors.push('JWT_SECRET повинен містити мінімум 32 символи')
    }

    if (SESSION_CONFIG.SECRET === 'session-secret-change-in-production') {
      errors.push('SESSION_SECRET повинен бути змінений для продакшну')
    }

    if (!AUTH0_CONFIG.BASE_URL.startsWith('https://')) {
      errors.push('AUTH0_BASE_URL повинен використовувати HTTPS в продакшні')
    }
  } else {
    // Попередження для розробки
    if (AUTH0_CONFIG.SECRET === 'default-secret-change-in-production') {
      warnings.push('AUTH0_SECRET використовує значення за замовчуванням')
    }

    if (JWT_CONFIG.SECRET === 'jwt-secret-change-in-production') {
      warnings.push('JWT_SECRET використовує значення за замовчуванням')
    }

    if (SESSION_CONFIG.SECRET === 'session-secret-change-in-production') {
      warnings.push('SESSION_SECRET використовує значення за замовчуванням')
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  }
}
