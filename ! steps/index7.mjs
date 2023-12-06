/*
 ? Перевіряємо шлях, за яким звертається користувач
*/

import http from 'http'
import { htmlTemplate, todos } from './data.mjs'

const PORT = 3000

const server = http.createServer((req, res) => {
  // Якщо URL запиту дорівнює '/', тобто користувач звертається до головної сторінки
  if (req.url === '/') {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/html')
    res.end(htmlTemplate)
  }
  // Якщо URL запиту дорівнює '/text', тобто користувач звертається до сторінки '/text'
  if (req.url === '/text') {
    res.statusCode = 200
    // Встановлюємо заголовок 'Content-Type' відповіді як 'text/plain', що означає, що вміст відповіді є простим текстом
    res.setHeader('Content-Type', 'text/plain')
    // Відправляємо відповідь 'Plain text from HTTP server'
    res.end('Plain text from HTTP server')
  }
  // Якщо URL запиту дорівнює '/json', тобто користувач звертається до сторінки '/json'
  if (req.url === '/json') {
    res.statusCode = 200
    // Встановлюємо заголовок 'Content-Type' відповіді як 'application/json', що означає, що вміст відповіді є JSON
    res.setHeader('Content-Type', 'application/json')
    // Відправляємо відповідь у форматі JSON, перетворивши об'єкт todos в рядок JSON
    res.end(JSON.stringify(todos))
  }
})

server.listen(PORT, () => {
  console.log(`The server is running on port ${PORT}`)
})
