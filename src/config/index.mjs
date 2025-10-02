import 'dotenv/config'

const expand = (value) => {
  if (!value || typeof value !== 'string') return value
  return value.replace(/\$\{([^}]+)\}/g, (_, name) => process.env[name] ?? '')
}

const fallbackLocalUri = 'mongodb://127.0.0.1:27017/'
const fallbackDbName = 'atlas-products'

const parseBoolean = (value, fallback) => {
  if (value === undefined || value === null) return fallback
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase()
    if (normalized === 'true') return true
    if (normalized === 'false') return false
  }

  return Boolean(value)
}

const parseInteger = (value) => {
  const numeric = Number(value)
  return Number.isFinite(numeric) && numeric > 0 ? Math.floor(numeric) : undefined
}

const rawUri = expand(
  process.env.MONGODB_URI || process.env.MAIN_MONGODB_URI || process.env.MONGO_URI || process.env.DATABASE_URL || ''
)

const rootUser = process.env.MAIN_DB_ROOT_USER || process.env.MONGODB_USER || ''
const rootPass = process.env.MAIN_DB_ROOT_PASS || process.env.MONGODB_PASSWORD || ''
const authSource = process.env.MONGODB_AUTH_SOURCE || 'admin'
const dbName = process.env.DB_NAME || process.env.MAIN_DB_NAME || fallbackDbName
const nodeEnv = process.env.NODE_ENV || 'development'
const autoIndex = parseBoolean(process.env.MONGOOSE_AUTO_INDEX, nodeEnv !== 'production')
const maxPoolSize = parseInteger(process.env.MONGOOSE_MAX_POOL_SIZE)

const parsePort = (value, fallback) => {
  const numeric = Number(value)
  return Number.isInteger(numeric) && numeric > 0 ? numeric : fallback
}

export const SERVER_CONFIG = {
  PORT: parsePort(process.env.APP_PORT || process.env.PORT, 3000),
  HOST: process.env.APP_HOST || process.env.HOST || '0.0.0.0'
}

export const DATABASE_CONFIG = {
  URI: rawUri || fallbackLocalUri,
  NAME: dbName,
  USER: rootUser,
  PASSWORD: rootPass,
  AUTH_SOURCE: authSource,
  AUTO_INDEX: autoIndex,
  MAX_POOL_SIZE: maxPoolSize
}

export const buildMongoConnectionString = (overrideUri, overrideDbName) => {
  const baseUri = expand(overrideUri) || DATABASE_CONFIG.URI
  const targetDbName = overrideDbName || DATABASE_CONFIG.NAME

  if (!baseUri.startsWith('mongodb://') && !baseUri.startsWith('mongodb+srv://')) {
    throw new Error('MONGODB_URI повинен починатися з "mongodb://" або "mongodb+srv://"')
  }

  try {
    const url = new URL(baseUri)

    if (!url.username && DATABASE_CONFIG.USER) {
      url.username = encodeURIComponent(DATABASE_CONFIG.USER)
    }

    if (!url.password && DATABASE_CONFIG.PASSWORD) {
      url.password = encodeURIComponent(DATABASE_CONFIG.PASSWORD)
    }

    const currentPath = url.pathname.replace(/\/+$/, '')
    const currentDb = currentPath ? currentPath.slice(1) : ''

    if (!currentDb || currentDb === 'admin') {
      url.pathname = `/${targetDbName}`
      url.searchParams.set('authSource', DATABASE_CONFIG.AUTH_SOURCE || 'admin')
    }

    return url.toString()
  } catch (error) {
    const suffix = baseUri.endsWith('/') ? '' : '/'
    return `${baseUri}${suffix}${targetDbName}`
  }
}
