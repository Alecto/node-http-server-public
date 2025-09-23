import express from 'express'
import methodOverride from 'method-override'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { SERVER_CONFIG } from './config/index.mjs'
import apiRouter from './routes/api/index.mjs'
import webRouter from './routes/web/index.mjs'
import { setupGlobalErrorHandlers, expressErrorHandler } from './middleware/errorHandlers.mjs'
import * as logger from './utils/logger.mjs'

// Отримуємо __dirname для ES модулів
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Створення Express додатку
const app = express()

// Налаштування глобальних обробників помилок
setupGlobalErrorHandlers()

// Налаштування EJS як template engine
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

// Middleware для парсингу body запитів
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Method override для підтримки PUT та DELETE запитів
app.use(methodOverride('_method'))

// Статичні файли
app.use(express.static(path.join(__dirname, 'public')))

// Middleware для логування запитів
app.use((req, res, next) => {
  logger.log(`${req.method} ${req.url}`)
  next()
})

// Налаштування маршрутів
app.use('/api', apiRouter) // JSON API endpoints
app.use('/', webRouter) // HTML Web Interface

// 404 Handler: JSON для API, EJS для Web
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({
      success: false,
      error: 'API endpoint not found',
      path: req.originalUrl
    })
  }
  // HTML 404 для Web
  logger.log(`Сторінку не знайдено: ${req.originalUrl}`)
  res.status(404).render('404')
})

// Express error middleware (має бути ПІСЛЯ всіх роутів)
app.use(expressErrorHandler)

// Запуск сервера
const server = app.listen(SERVER_CONFIG.PORT, SERVER_CONFIG.HOST, () => {
  logger.log(`Express сервер запущено на http://${SERVER_CONFIG.HOST}:${SERVER_CONFIG.PORT}`)
})

// Обробка сигналів завершення роботи
process.on('SIGTERM', () => {
  logger.log('SIGTERM отримано, закриваємо сервер')
  server.close(() => {
    logger.log('Сервер закрито')
    process.exit(0)
  })
})

process.on('SIGINT', () => {
  logger.log('SIGINT отримано, закриваємо сервер')
  server.close(() => {
    logger.log('Сервер закрито')
    process.exit(0)
  })
})
