/*
 ? Перевіряємо шлях, за яким звертається користувач
*/

import http from 'http'
import { generate404, generateForm, generateHTML, generateJSON, generateText, generateTodos, postData } from './api.mjs'

const PORT = 3000

const server = http.createServer((req, res) => {

  if (req.method === 'GET' && req.url === '/') return generateHTML(req, res) // GET && root

  if (req.method === 'GET' && req.url === '/text') return generateText(req, res) // GET && plain text

  if (req.method === 'GET' && req.url === '/json') return generateJSON(req, res) // GET && json

  if (req.method === 'GET' && req.url === '/todos') return generateTodos(req, res) // GET && json todos
  if (req.method === 'POST' && req.url === '/todos') return postData(req, res) // POST && tod0

  if (req.method === 'GET' && req.url === '/form') return generateForm(req, res)

  generate404(req, res) // 404
})

server.listen(PORT, () => {
  console.log(`The server is running on port ${PORT}`)
})


