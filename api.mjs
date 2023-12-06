import { formTemplate, notFoundTemplate, rootHtmlTemplate, todos } from './data.mjs'

const generateHTML = (req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/html')
  res.end(rootHtmlTemplate)
}

const generateForm = (req, res) => {
  if (!formTemplate) {
    res.statusCode = 500
    res.setHeader('Content-Type', 'text/plain')
    res.end('Error: Form template not loaded')
  } else {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/html')
    res.end(formTemplate)
  }
}

/*
 ! Отримаємо помилку:
 Content-Type: application/x-www-form-urlencoded
 - можна побачити в Devtool -> Network -> Headers
*/


const generateText = (req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/plain')
  res.end('Plain text from HTTP server')
}

const generateJSON = (req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(todos))
}

const postData = (req, res) => {
  res.setHeader('Content-Type', 'text/plain')

  // ! - робота з формою не підтримується:
  // Content-Type: application/x-www-form-urlencoded
  // Обробляємо тільки JSON формат

  if (req.headers['content-type'] === 'application/json') {
    let dataJSON = ''

    req.on('data', (chunk) => dataJSON += chunk)

    req.on('end', () => {
      try {
        todos.push(JSON.parse(dataJSON))
        res.statusCode = 200
        res.end('Todo data was received')
      } catch (err) {
        res.statusCode = 400
        res.end('Invalid JSON')
      }
    })
  } else {
    res.statusCode = 400
    res.end('Todo data must be in JSON format')
  }
}

const generate404 = (req, res) => {
  res.statusCode = 404
  res.setHeader('Content-Type', 'text/html')
  res.end(notFoundTemplate)
}

export { generateHTML, generateText, generateJSON, generate404, postData, generateForm }
