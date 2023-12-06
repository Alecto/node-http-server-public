/*
 ? Перевіряємо шлях, за яким звертається користувач
 Після того, як код побудований, показати запити з Postman
*/

import http from 'http'
import { generate404, generateHTML, generateJSON, generateText, postData } from './api.mjs'

const PORT = 3000

const server = http.createServer((req, res) => {

  if (req.method === 'GET' && req.url === '/') {
    return generateHTML(req, res)
  }

  if (req.method === 'GET' && req.url === '/text') {
    return generateText(req, res)
  }

  if (req.method === 'GET' && req.url === '/json') {
    return generateJSON(req, res)
  }

  //  GET todos
  if (req.method === 'GET' && req.url === '/todos') {
    return generateJSON(req, res)
  }
  //  POST todos
  if (req.method === 'POST' && req.url === '/todos') {
    return postData(req, res)
  }

  generate404(req, res)
})

server.listen(PORT, () => {
  console.log(`The server is running on port ${PORT}`)
})


