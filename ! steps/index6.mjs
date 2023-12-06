/*
 ? Налаштовуємо response від сервера => HTML, шаблонний рядок
*/

import http from 'http'
import { htmlTemplate } from './data.mjs'

const PORT = 3000

const server = http.createServer((req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/html')
  // ! можемо записати через res.write
  // res.write(htmlTemplate)
  // res.end()
  // ! або скоротити, та одразу повернути рядок через res.end
  res.end(htmlTemplate)
})

server.listen(PORT, () => {
  console.log(`The server is running on port ${PORT}`)
})
