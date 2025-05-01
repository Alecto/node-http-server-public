import { rootHtmlTemplate, notFoundTemplate } from '../utils/templates.mjs'
import * as logger from '../utils/logger.mjs'
import { handleControllerError } from '../middleware/errorHandlers.mjs'

// Головна сторінка
export const getHomePage = async (req, res) => {
  try {
    logger.log('Відображення головної сторінки')
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.end(rootHtmlTemplate)
  } catch (error) {
    handleControllerError(error, res, 'Помилка при відображенні головної сторінки')
  }
}

// Текстова сторінка
export const getTextPage = async (req, res) => {
  try {
    logger.log('Відображення текстової сторінки')
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    res.end('Текст з HTTP сервера')
  } catch (error) {
    handleControllerError(error, res, 'Помилка при відображенні текстової сторінки')
  }
}

// Сторінка 404
export const getNotFoundPage = async (req, res) => {
  try {
    logger.log(`Сторінку не знайдено: ${req.url}`)
    res.statusCode = 404
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.end(notFoundTemplate)
  } catch (error) {
    handleControllerError(error, res, 'Помилка при відображенні сторінки 404')
  }
}
