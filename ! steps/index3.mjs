/*
 ? Налаштовуємо response від сервера => HTML
*/

import http from 'http'

const PORT = 3000

const server = http.createServer((req, res) => {
  // Встановлюємо код статусу відповіді як 200, що означає 'OK'
  res.statusCode = 200
  // ! Встановлюємо заголовок 'Content-Type' відповіді як 'text/html', що означає, що вміст відповіді є HTML
  res.setHeader('Content-Type', 'text/html')
  // ! Відправляємо відповідь '<h1>Hello from HTTP server</h1>', що буде відображено як заголовок першого рівня на веб-сторінці
  res.end('<h1>Hello from HTTP server</h1>')
})

server.listen(PORT, () => {
  console.log(`The server is running on port ${PORT}`)
})
