/*
 ? Перевіряємо шлях, за яким звертається користувач
*/

import http from 'http'
import { notFoundTemplate, rootHtmlTemplate, todos } from './data.mjs'

const PORT = 3000

const server = http.createServer((req, res) => {

  if (req.url === '/') {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/html')
    return res.end(rootHtmlTemplate)
  }

  if (req.url === '/text') {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/plain')
    return res.end('Plain text from HTTP server')
  }

  if (req.url === '/json') {
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    return res.end(JSON.stringify(todos))
  }

  res.statusCode = 404
  res.setHeader('Content-Type', 'text/html')
  return res.end(notFoundTemplate)
})

server.listen(PORT, () => {
  console.log(`The server is running on port ${PORT}`)
})
