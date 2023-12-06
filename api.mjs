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
  // Створюємо змінну dataJSON для зберігання даних, що надійшли
  let dataJSON = ''

  // Коли дані надходять, ми додаємо їх до змінної data
  req.on('data', (chunk) => dataJSON += chunk)

  // Коли дані припиняють надходити, ми виводимо їх в консоль і відправляємо відповідь користувачу
  req.on('end', () => {
    console.log(`Data: ${dataJSON}`)
    // Встановлюємо код статусу відповіді як 200, що означає 'OK'
    res.statusCode = 200
    // Відправляємо відповідь 'To do data was received'
    res.end('Todo data was received')
  })
}

const generate404 = (req, res) => {
  res.statusCode = 404
  res.setHeader('Content-Type', 'text/html')
  return res.end(notFoundTemplate)
}

export { generateHTML, generateText, generateJSON, generate404, postData }
