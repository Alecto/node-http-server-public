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

  // Обробка Mongoose duplicate key error (код 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || 'поле'
    const message = `Продукт з таким значенням ${field} вже існує`

    if (req.path.startsWith('/api/')) {
      return res.status(409).json({
        success: false,
        error: message
      })
    }

    return res.status(409).render('500', { error: message })
  }

  // Обробка Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message)
    const errorMessage = messages.join('. ')

    if (req.path.startsWith('/api/')) {
      return res.status(400).json({
        success: false,
        error: errorMessage
      })
    }

    return res.status(400).render('500', { error: errorMessage })
  }

  // Обробка Mongoose CastError (невалідні типи даних)
  if (err.name === 'CastError') {
    const message = 'Невалідний формат даних'

    if (req.path.startsWith('/api/')) {
      return res.status(400).json({
        success: false,
        error: message
      })
    }

    return res.status(400).render('500', { error: message })
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

// Налаштування глобальних обробників помилок для Node.js процесу
// Ці обробники перехоплюють помилки на рівні всього додатку,
// які не були перехоплені іншими try-catch блоками
export const setupGlobalErrorHandlers = () => {
  // Необроблені винятки в синхронному коді
  process.on('uncaughtException', (err) => {
    logger.error('Необроблений виняток у процесі Node.js:', err)
    logger.error('Завершення процесу через критичну помилку')
    process.exit(1)
  })

  // Необроблені відмови промісів (помилки в асинхронному коді)
  process.on('unhandledRejection', (reason, promise) => {
    logger.error('Необроблена відмова промісу у процесі Node.js:', reason)
    logger.error('Promise:', promise)
    logger.error('Завершення процесу через критичну помилку')
    process.exit(1)
  })
}
