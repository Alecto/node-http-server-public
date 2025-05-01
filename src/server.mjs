import http from 'node:http'
import { SERVER_CONFIG } from './config/index.mjs'
import { handleRequest } from './routes/router.mjs'
import { setupGlobalErrorHandlers } from './middleware/errorHandlers.mjs'
import { initFormTemplate } from './controllers/formController.mjs'
import * as logger from './utils/logger.mjs'

// Налаштування глобальних обробників помилок
setupGlobalErrorHandlers()

// Ініціалізація шаблону форми
initFormTemplate().catch((err) => {
  logger.error('Помилка при ініціалізації шаблону форми:', err)
})

// Створення HTTP сервера
const server = http.createServer(handleRequest)

// Запуск сервера
server.listen(SERVER_CONFIG.PORT, SERVER_CONFIG.HOST, () => {
  logger.log(`Сервер запущено на http://${SERVER_CONFIG.HOST}:${SERVER_CONFIG.PORT}`)
})

// Обробка сигналів завершення роботи
// Ці обробники забезпечують граційне завершення роботи сервера,
// коли операційна система надсилає сигнали SIGTERM або SIGINT (Ctrl+C)
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
