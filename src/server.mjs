import express from 'express'
import methodOverride from 'method-override'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { SERVER_CONFIG } from './config/index.mjs'
import { connectToDatabase, disconnectFromDatabase } from './database/connection.mjs'
import { ProductModel } from './models/products.mjs'
import { setupGlobalErrorHandlers, expressErrorHandler } from './middleware/errorHandlers.mjs'
import apiRouter from './routes/api/index.mjs'
import webRouter from './routes/web/index.mjs'
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

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`)
  next()
})

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

  await ProductModel.syncIndexes()

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
