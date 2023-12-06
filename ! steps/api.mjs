import { notFoundTemplate, rootHtmlTemplate, todos } from './data.mjs'

const generateHTML = (req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/html')
  return res.end(rootHtmlTemplate)
}

const generateText = (req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/plain')
  return res.end('Plain text from HTTP server')
}

const generateJSON = (req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  return res.end(JSON.stringify(todos))
}

const postData = (req, res) => {
  let dataJSON = ''

  req.on('data', (chunk) => dataJSON += chunk)

  req.on('end', () => {
    // Додаємо нове завдання до нашого списку завдань, перетворивши отримані дані з рядка JSON у об'єкт JavaScript
    todos.push(JSON.parse(dataJSON))
    res.statusCode = 200
    res.end('Todo data was received')
  })
}

const generate404 = (req, res) => {
  res.statusCode = 404
  res.setHeader('Content-Type', 'text/html')
  return res.end(notFoundTemplate)
}

export { generateHTML, generateText, generateJSON, generate404, postData }
