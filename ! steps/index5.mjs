/*
 ? Налаштовуємо response від сервера => HTML, шаблонний рядок
*/

import http from 'http'

const PORT = 3000

const server = http.createServer((req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/html')
  res.write(`
    <!DOCTYPE html>
    <html lang='en'>
    
    <head>
      <meta charset='UTF-8'>
      <meta name='viewport' content='width=device-width, initial-scale=1.0'>
      <title>HTTP server</title>
    </head>
    
    <body style='font-family: Arial, sans-serif'>
      <div style='width: min(100% - 40px, 992px); margin-inline: auto;'>
          <h1>Hello from HTTP server</h1>
      </div>  
    </body>
    
    </html>
  `)
  res.end()
})

server.listen(PORT, () => {
  console.log(`The server is running on port ${PORT}`)
})
