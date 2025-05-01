import { loadFormTemplate } from '../utils/templates.mjs'
import * as logger from '../utils/logger.mjs'
import { handleControllerError } from '../middleware/errorHandlers.mjs'

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
      res.statusCode = 500
      res.setHeader('Content-Type', 'text/plain; charset=utf-8')
      res.end('Помилка: Шаблон форми не завантажено')
    } else {
      res.statusCode = 200
      res.setHeader('Content-Type', 'text/html; charset=utf-8')
      res.end(formTemplate)
    }
  } catch (error) {
    handleControllerError(error, res, 'Помилка при відображенні форми')
  }
}
