import 'dotenv/config'

const expand = (value) => {
  if (!value || typeof value !== 'string') return value
  return value.replace(/\$\{([^}]+)\}/g, (_, name) => process.env[name] ?? '')
}

const fallbackLocalUri = 'mongodb://127.0.0.1:27017/'
const fallbackDbName = 'atlas-products'

const rawUri = expand(
  process.env.MONGODB_URI || process.env.MAIN_MONGODB_URI || process.env.MONGO_URI || process.env.DATABASE_URL || ''
)

const rootUser = process.env.MAIN_DB_ROOT_USER || process.env.MONGODB_USER || ''
const rootPass = process.env.MAIN_DB_ROOT_PASS || process.env.MONGODB_PASSWORD || ''
const authSource = process.env.MONGODB_AUTH_SOURCE || 'admin'
const dbName = process.env.DB_NAME || process.env.MAIN_DB_NAME || fallbackDbName
const shouldSeed = (process.env.DB_SEED ?? 'true').toLowerCase() === 'true'

export const SERVER_CONFIG = {
  PORT: Number(process.env.APP_PORT || process.env.PORT || 3000),
  HOST: process.env.APP_HOST || process.env.HOST || '0.0.0.0'
}

export const DATABASE_CONFIG = {
  URI: rawUri || fallbackLocalUri,
  NAME: dbName,
  USER: rootUser,
  PASSWORD: rootPass,
  AUTH_SOURCE: authSource,
  SEED: shouldSeed
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
