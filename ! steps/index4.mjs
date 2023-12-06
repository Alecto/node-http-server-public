/*
 ? Налаштовуємо response від сервера => HTML
*/

import http from 'http'

const PORT = 3000

const server = http.createServer((req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/html')
  // ! Починаємо записувати HTML-вміст у відповідь
  res.write('<html lang="en"><body>')
  // ! Додаємо заголовок першого рівня до HTML-вмісту відповіді
  res.write('<h1>Hello from HTTP server</h1>')
  // ! Закінчуємо HTML-вміст відповіді
  res.write('</body></html>')
  // Закінчуємо відповідь, що дозволяє серверу відправити відповідь назад до клієнта
  res.end()
})

server.listen(PORT, () => {
  console.log(`The server is running on port ${PORT}`)
})
