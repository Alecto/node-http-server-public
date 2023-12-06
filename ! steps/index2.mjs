/*
 ? Налаштовуємо response від сервера => звичайний текст
*/

import http from 'http'

const PORT = 3000

const server = http.createServer((req, res) => {
  // ! Встановлюємо код статусу відповіді як 200, що означає 'OK'
  res.statusCode = 200
  // ! Встановлюємо заголовок 'Content-Type' відповіді як 'text/plain'
  res.setHeader('Content-Type', 'text/plain')
  // Відправляємо відповідь 'Hello from HTTP server' (Привіт від HTTP сервера)
  res.end('Hello from HTTP server')
})

server.listen(PORT, () => {
  console.log(`The server is running on port ${PORT}`)
})
