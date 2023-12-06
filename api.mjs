import { notFoundTemplate, rootHtmlTemplate, todos } from './data.mjs'

const generateHTML = (req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/html')
  return res.end(rootHtmlTemplate)
}

const generateText = (req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/plain')
  return res.end('Plain text from HTTP server')
}

const generateJSON = (req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  return res.end(JSON.stringify(todos))
}

const generate404 = (req, res) => {
  res.statusCode = 404
  res.setHeader('Content-Type', 'text/html')
  return res.end(notFoundTemplate)
}

export { generateHTML, generateText, generateJSON, generate404 }
