import * as logger from '../utils/logger.mjs'
import { HTTP_STATUS, CONTENT_TYPE } from '../config/http.mjs'

// Express error middleware (4 параметри обов'язкові!)
// Автоматично перехоплює помилки, що виникли в роутах або middleware
export const expressErrorHandler = (err, req, res, next) => {
  logger.error('Express middleware перехопив помилку:', err)

  // Якщо відповідь вже відправлена, передаємо помилку стандартному обробнику Express
  if (res.headersSent) {
    return next(err)
  }

  // Визначаємо тип відповіді на основі Accept header або Content-Type запиту
  const acceptsJSON = req.accepts(['html', 'json']) === 'json'

  if (acceptsJSON || req.path.startsWith('/api/')) {
    // JSON відповідь для API ендпоінтів
    res.status(500).json({
      success: false,
      error: 'Внутрішня помилка сервера'
    })
  } else {
    // HTML відповідь для веб-інтерфейсу
    try {
      res.status(500).render('500', {
        error: 'Внутрішня помилка сервера'
      })
    } catch (renderError) {
      // Якщо не вдається відрендерити шаблон помилки
      res.status(500).send('Внутрішня помилка сервера')
    }
  }
}

// Обробник помилок на рівні HTTP запитів (middleware)
// Використовується в маршрутизаторі для обробки помилок, що виникають під час обробки HTTP запитів
// Формує HTTP відповідь з кодом 500 для клієнта
export const requestErrorHandler = (error, req, res) => {
  logger.error('Необроблена помилка HTTP запиту:', error)

  // Якщо відповідь ще не відправлена
  if (!res.headersSent) {
    res.statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR
    res.setHeader('Content-Type', CONTENT_TYPE.TEXT)
    res.end('Внутрішня помилка сервера')
  }
}

// Обробник помилок для контролерів
// Використовується всередині блоків catch у функціях контролерів
// Дозволяє вказати конкретне повідомлення про помилку в логах
export const handleControllerError = (error, res, message = 'Внутрішня помилка сервера') => {
  logger.error(message, error)
  res.statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR
  res.setHeader('Content-Type', CONTENT_TYPE.TEXT)
  res.end('Внутрішня помилка сервера')
}

// Налаштування глобальних обробників помилок для Node.js процесу
// Ці обробники перехоплюють помилки на рівні всього додатку,
// які не були перехоплені іншими try-catch блоками
export const setupGlobalErrorHandlers = () => {
  // Необроблені винятки в синхронному коді
  process.on('uncaughtException', (err) => {
    logger.error('Необроблений виняток у процесі Node.js:', err)
  })

  // Необроблені відмови промісів (помилки в асинхронному коді)
  process.on('unhandledRejection', (reason) => {
    logger.error('Необроблена відмова промісу у процесі Node.js:', reason)
  })
}
