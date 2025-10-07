import express from 'express'
import methodOverride from 'method-override'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { auth } from 'express-openid-connect'
import { SERVER_CONFIG } from './config/index.mjs'
import { getAuth0Config, validateAuthConfig, AUTH0_CONFIG } from './config/auth.mjs'
import { connectToDatabase, disconnectFromDatabase } from './database/connection.mjs'
import { ProductModel } from './models/products.mjs'
import { UserModel } from './models/user.mjs'
import { setupGlobalErrorHandlers, expressErrorHandler } from './middleware/errorHandlers.mjs'
import apiRouter from './routes/api/index.mjs'
import webRouter from './routes/web/index.mjs'
import authRouter from './routes/auth/index.mjs'
import * as logger from './utils/logger.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const app = express()

setupGlobalErrorHandlers()

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))

// Auth0 middleware (якщо увімкнено)
if (AUTH0_CONFIG.ENABLED) {
  const authConfig = getAuth0Config()
  app.use(auth(authConfig))
  logger.info('Auth0 middleware увімкнено')
} else {
  logger.warn('Auth0 middleware вимкнено')
}

// Middleware для автоматичного збереження користувача в БД після Auth0 входу
app.use(async (req, res, next) => {
  try {
    // Перевіряємо чи користувач автентифікований через Auth0
    if (req.oidc && req.oidc.isAuthenticated && req.oidc.isAuthenticated()) {
      const auth0User = req.oidc.user

      if (auth0User && auth0User.sub) {
        // Перевіряємо чи користувач вже в БД
        const existingUser = await UserModel.findOne({ auth0Id: auth0User.sub })

        if (!existingUser) {
          // Новий користувач - створюємо запис
          const providerMatch = auth0User.sub.match(/^([^|]+)\|/)
          const provider = providerMatch ? providerMatch[1] : 'auth0'

          const newUser = await UserModel.create({
            auth0Id: auth0User.sub,
            email: auth0User.email,
            name: auth0User.name || auth0User.email,
            picture: auth0User.picture,
            provider,
            lastLogin: new Date()
          })

          logger.info('Новий користувач автоматично створено', {
            userId: newUser._id,
            email: newUser.email,
            auth0Id: newUser.auth0Id
          })
        } else {
          // Оновлюємо lastLogin якщо пройшло більше 5 хвилин
          const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
          if (!existingUser.lastLogin || existingUser.lastLogin < fiveMinutesAgo) {
            existingUser.lastLogin = new Date()
            existingUser.email = auth0User.email
            existingUser.name = auth0User.name || auth0User.email
            existingUser.picture = auth0User.picture
            await existingUser.save()
            logger.debug('Користувач оновлено', { userId: existingUser._id })
          }
        }
      }
    }
  } catch (error) {
    logger.error('Помилка в middleware збереження користувача:', error)
  }

  next()
})

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`)
  next()
})

// Додаємо інформацію про користувача в локальні змінні для EJS
app.use((req, res, next) => {
  res.locals.user = req.oidc?.user || null
  res.locals.isAuthenticated = req.oidc?.isAuthenticated() || false
  next()
})

app.use('/auth', authRouter)
app.use('/api', apiRouter)
app.use('/', webRouter)

app.use((req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ success: false, error: 'API endpoint not found', path: req.originalUrl })
  }

  logger.warn(`Сторінку не знайдено: ${req.originalUrl}`)
  res.status(404).render('404')
})

app.use(expressErrorHandler)

let serverInstance = null

export const startServer = async (options = {}) => {
  const { connection } = await connectToDatabase(options)

  if (!connection || connection.readyState !== 1) {
    throw new Error('Не вдалося встановити підключення до MongoDB')
  }

  // Валідація Auth0 конфігурації
  const authValidation = validateAuthConfig()
  if (!authValidation.valid) {
    logger.error('Помилки конфігурації Auth0:', authValidation.errors)
    throw new Error('Некоректна конфігурація Auth0')
  }
  if (authValidation.warnings?.length > 0) {
    authValidation.warnings.forEach((warning) => logger.warn(`Auth0: ${warning}`))
  }

  // Синхронізація індексів для моделей
  await ProductModel.syncIndexes()
  await UserModel.syncIndexes()
  logger.info('MongoDB індекси синхронізовано')

  if (!serverInstance) {
    serverInstance = app.listen(SERVER_CONFIG.PORT, SERVER_CONFIG.HOST, () => {
      logger.info(`Express сервер запущено на http://${SERVER_CONFIG.HOST}:${SERVER_CONFIG.PORT}`)
    })
  }

  return { server: serverInstance, connection }
}

export const stopServer = async () => {
  if (serverInstance) {
    await new Promise((resolve) => serverInstance.close(resolve))
    logger.info('Express сервер зупинено')
    serverInstance = null
  }

  await disconnectFromDatabase()
}

if (import.meta.url === `file://${__filename}`) {
  startServer().catch((error) => {
    logger.error('Помилка запуску сервера:', error)
    process.exit(1)
  })
}

process.on('SIGTERM', () => {
  logger.info('SIGTERM отримано, завершуємо роботу')
  stopServer().finally(() => process.exit(0))
})

process.on('SIGINT', () => {
  logger.info('SIGINT отримано, завершуємо роботу')
  stopServer().finally(() => process.exit(0))
})
