import { getHomePage, getTextPage, getNotFoundPage } from '../controllers/pageController.mjs'
import { getTodos, getTodosJSON, createTodo } from '../controllers/todoController.mjs'
import { getForm } from '../controllers/formController.mjs'
import { requestErrorHandler } from '../middleware/errorHandlers.mjs'
import * as logger from '../utils/logger.mjs'

// Карта маршрутів для різних HTTP-методів
const routes = {
  GET: {
    '/': getHomePage,
    '/text': getTextPage,
    '/json': getTodosJSON,
    '/todos': getTodos,
    '/form': getForm
  },
  POST: {
    '/todos': createTodo
  }
}

// Функція для маршрутизації запитів
export const handleRequest = async (req, res) => {
  try {
    logger.log(`${req.method} ${req.url}`)

    // Отримуємо базовий шлях без параметрів запиту
    const path = req.url.split('?')[0]

    // Перевіряємо наявність обробника для методу та шляху
    const methodRoutes = routes[req.method]
    if (methodRoutes) {
      const handler = methodRoutes[path]
      if (handler) {
        return await handler(req, res)
      }
    }

    // Якщо маршрут не знайдено
    await getNotFoundPage(req, res)
  } catch (error) {
    requestErrorHandler(error, req, res)
  }
}
