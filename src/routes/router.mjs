import { getHomePage, getTextPage, getNotFoundPage } from '../controllers/pageController.mjs'
import { getTodos, getTodosJSON, createTodo } from '../controllers/todoController.mjs'
import { getForm } from '../controllers/formController.mjs'
import { errorHandler } from '../middleware/errorHandler.mjs'
import * as logger from '../utils/logger.mjs'

// Функція для маршрутизації запитів
export const handleRequest = async (req, res) => {
  try {
    logger.log(`${req.method} ${req.url}`)
    
    // Маршрутизація GET запитів
    if (req.method === 'GET') {
      // Головна сторінка
      if (req.url === '/') {
        return await getHomePage(req, res)
      }
      
      // Текстова сторінка
      if (req.url === '/text') {
        return await getTextPage(req, res)
      }
      
      // JSON сторінка
      if (req.url === '/json') {
        return await getTodosJSON(req, res)
      }
      
      // Сторінка зі списком todos
      if (req.url === '/todos') {
        return await getTodos(req, res)
      }
      
      // Сторінка з формою
      if (req.url === '/form') {
        return await getForm(req, res)
      }
    }
    
    // Маршрутизація POST запитів
    if (req.method === 'POST') {
      // Додавання нового todo
      if (req.url === '/todos') {
        return await createTodo(req, res)
      }
    }
    
    // Якщо маршрут не знайдено
    await getNotFoundPage(req, res)
  } catch (error) {
    errorHandler(error, req, res)
  }
} 
