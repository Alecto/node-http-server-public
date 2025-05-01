import { loadFormTemplate } from '../utils/templates.mjs'
import * as logger from '../utils/logger.mjs'
import { handleControllerError } from '../middleware/errorHandlers.mjs'
import { HTTP_STATUS, CONTENT_TYPE } from '../config/http.mjs'

// Змінна для зберігання шаблону форми
let formTemplate = null

// Ініціалізація шаблону форми
export const initFormTemplate = async () => {
  formTemplate = await loadFormTemplate()
  return formTemplate
}

// Відображення форми
export const getForm = async (req, res) => {
  try {
    logger.log('Відображення форми')

    // Перша перевірка: ледаче завантаження шаблону, якщо його ще немає в пам'яті
    if (!formTemplate) {
      formTemplate = await initFormTemplate()
    }

    // Друга перевірка: обробка випадку, коли шаблон не вдалося завантажити
    if (!formTemplate) {
      logger.error('Шаблон форми не завантажено')
      res.statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR
      res.setHeader('Content-Type', CONTENT_TYPE.TEXT)
      res.end('Помилка: Шаблон форми не завантажено')
    } else {
      res.statusCode = HTTP_STATUS.OK
      res.setHeader('Content-Type', CONTENT_TYPE.HTML)
      res.end(formTemplate)
    }
  } catch (error) {
    handleControllerError(error, res, 'Помилка при відображенні форми')
  }
}
