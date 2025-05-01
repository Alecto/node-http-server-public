import { rootHtmlTemplate, notFoundTemplate } from '../utils/templates.mjs'
import * as logger from '../utils/logger.mjs'
import { handleControllerError } from '../middleware/errorHandlers.mjs'
import { HTTP_STATUS, CONTENT_TYPE } from '../config/http.mjs'

// Головна сторінка
export const getHomePage = async (req, res) => {
  try {
    logger.log('Відображення головної сторінки')
    res.statusCode = HTTP_STATUS.OK
    res.setHeader('Content-Type', CONTENT_TYPE.HTML)
    res.end(rootHtmlTemplate)
  } catch (error) {
    handleControllerError(error, res, 'Помилка при відображенні головної сторінки')
  }
}

// Текстова сторінка
export const getTextPage = async (req, res) => {
  try {
    logger.log('Відображення текстової сторінки')
    res.statusCode = HTTP_STATUS.OK
    res.setHeader('Content-Type', CONTENT_TYPE.TEXT)
    res.end('Текст з HTTP сервера')
  } catch (error) {
    handleControllerError(error, res, 'Помилка при відображенні текстової сторінки')
  }
}

// Сторінка 404
export const getNotFoundPage = async (req, res) => {
  try {
    logger.log(`Сторінку не знайдено: ${req.url}`)
    res.statusCode = HTTP_STATUS.NOT_FOUND
    res.setHeader('Content-Type', CONTENT_TYPE.HTML)
    res.end(notFoundTemplate)
  } catch (error) {
    handleControllerError(error, res, 'Помилка при відображенні сторінки 404')
  }
}
