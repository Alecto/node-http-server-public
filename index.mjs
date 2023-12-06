/*
 ? Створюємо найпростіший сервер
*/

import http from 'http'

// Встановлюємо порт нашого сервера як 3000
const PORT = 3000

// Створюємо новий HTTP сервер
const server = http.createServer((req, res) => {
  // Виводимо об'єкт запиту в консоль
  console.log(req.url) // `/`
  console.log(req.method) // GET
  console.log(req)
  // Відправляємо відповідь 'Hello from HTTP server' (Привіт від HTTP сервера)
  res.end('Hello from HTTP server')
})

// Змушуємо сервер слухати зазначений порт і виводимо повідомлення в консоль, коли сервер починає прослуховування
server.listen(PORT, () => {
  console.log(`The server is running on port ${PORT}`) // Сервер працює на порту ${PORT}
})
