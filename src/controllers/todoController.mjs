import querystring from 'node:querystring'
import { todos, addTodo, validateTodo } from '../models/todos.mjs'
import { readRequestBody } from '../utils/request.mjs'
import { generateTodosTemplate } from '../utils/templates.mjs'
import * as logger from '../utils/logger.mjs'
import { handleControllerError } from '../middleware/errorHandlers.mjs'
import { HTTP_STATUS, CONTENT_TYPE } from '../config/http.mjs'

// Отримання списку todos
export const getTodos = async (req, res) => {
  try {
    logger.log('Отримання списку todos')
    res.statusCode = HTTP_STATUS.OK
    res.setHeader('Content-Type', CONTENT_TYPE.HTML)
    res.end(generateTodosTemplate(todos))
  } catch (error) {
    handleControllerError(error, res, 'Помилка при отриманні списку todos')
  }
}

// Отримання списку todos у форматі JSON
export const getTodosJSON = async (req, res) => {
  try {
    logger.log('Отримання списку todos у форматі JSON')
    res.statusCode = HTTP_STATUS.OK
    res.setHeader('Content-Type', CONTENT_TYPE.JSON)
    res.end(JSON.stringify(todos))
  } catch (error) {
    handleControllerError(error, res, 'Помилка при отриманні списку todos у форматі JSON')
  }
}

// Додавання нового todo
export const createTodo = async (req, res) => {
  try {
    logger.log('Додавання нового todo')
    res.setHeader('Content-Type', CONTENT_TYPE.TEXT)

    const contentType = req.headers['content-type'] || ''
    const isFormRequest = contentType.includes(CONTENT_TYPE.FORM)
    const isJsonRequest = contentType.includes(CONTENT_TYPE.JSON.split(';')[0])

    if (isFormRequest) {
      const body = await readRequestBody(req)

      try {
        let todo = querystring.parse(body)

        todo = {
          id: +todo['id'],
          title: todo['title'],
          userId: +todo['userId'],
          completed: todo['completed'] === 'on'
        }

        if (!validateTodo(todo)) {
          logger.log('Невірні дані форми', todo)
          res.statusCode = HTTP_STATUS.BAD_REQUEST
          return res.end('Невірні дані форми: перевірте всі поля')
        }

        addTodo(todo)
        logger.log('Todo успішно додано', todo)

        res.statusCode = HTTP_STATUS.CREATED
        res.setHeader('Content-Type', CONTENT_TYPE.HTML)
        res.end(generateTodosTemplate(todos))
      } catch (err) {
        logger.error('Помилка обробки форми', err)
        res.statusCode = HTTP_STATUS.BAD_REQUEST
        res.end('Невірні дані форми')
      }
    } else if (isJsonRequest) {
      const dataJSON = await readRequestBody(req)

      try {
        const todo = JSON.parse(dataJSON)

        if (!validateTodo(todo)) {
          logger.log('Невірні дані JSON', todo)
          res.statusCode = HTTP_STATUS.BAD_REQUEST
          return res.end('Невірні дані JSON: перевірте всі поля')
        }

        addTodo(todo)
        logger.log('Todo успішно додано', todo)

        res.statusCode = HTTP_STATUS.CREATED
        res.end('Дані todo успішно отримано')
      } catch (err) {
        logger.error('Помилка обробки JSON', err)
        res.statusCode = HTTP_STATUS.BAD_REQUEST
        res.end('Невірний JSON')
      }
    } else {
      logger.log('Невірний Content-Type', req.headers['content-type'])
      res.statusCode = HTTP_STATUS.BAD_REQUEST
      res.end('Дані todo повинні бути у форматі JSON або форми')
    }
  } catch (error) {
    handleControllerError(error, res, 'Помилка обробки запиту')
  }
}
