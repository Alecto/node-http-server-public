/*
 ? Перевіряємо шлях, за яким звертається користувач
*/

import http from 'http'
import { htmlTemplate, todos } from './data.mjs'

const PORT = 3000

const server = http.createServer((req, res) => {

  if (req.url === '/') {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/html')
    res.end(htmlTemplate)
  }

  if (req.url === '/text') {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/plain')
    res.end('Plain text from HTTP server')
  }

  if (req.url === '/json') {
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(todos))
  }

})

server.listen(PORT, () => {
  console.log(`The server is running on port ${PORT}`)
})
