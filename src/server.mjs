import express from 'express'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import methodOverride from 'method-override'
import { SERVER_CONFIG } from './config/index.mjs'
import { setupGlobalErrorHandlers } from './middleware/errorHandlers.mjs'
import { setupRoutes } from './routes/router.mjs'
import * as logger from './utils/logger.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

setupGlobalErrorHandlers()

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))

setupRoutes(app)

const server = app.listen(SERVER_CONFIG.PORT, SERVER_CONFIG.HOST, () => {
  logger.log(`Express сервер запущено на http://${SERVER_CONFIG.HOST}:${SERVER_CONFIG.PORT}`)
})

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
