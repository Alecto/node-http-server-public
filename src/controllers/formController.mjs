import { loadFormTemplate } from '../utils/templates.mjs'
import * as logger from '../utils/logger.mjs'

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
    
    // Якщо шаблон ще не завантажено, спробуємо завантажити
    if (!formTemplate) {
      formTemplate = await initFormTemplate()
    }
    
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
    logger.error('Помилка при відображенні форми', error)
    res.statusCode = 500
    res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    res.end('Внутрішня помилка сервера')
  }
} 
