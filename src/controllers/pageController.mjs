import * as logger from '../utils/logger.mjs'

// Головна сторінка
export const getHomePage = (req, res) => {
  try {
    logger.log('Відображення головної сторінки')
    res.render('index')
  } catch (error) {
    logger.error('Помилка при відображенні головної сторінки:', error)
    res.status(500).send('Внутрішня помилка сервера')
  }
}
