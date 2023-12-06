import { notFoundTemplate, rootHtmlTemplate, todos } from './data.mjs'

const generateHTML = (req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/html')
  res.end(rootHtmlTemplate)
}

const generateText = (req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/plain')
  res.end('Plain text from HTTP server')
}

const generateJSON = (req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(todos))
}

// ! Раніше ми додавали return для завершення функції. Зараз return нам не потрібен, тому ми його видаляємо

const postData = (req, res) => {
  // Встановлюємо заголовок 'Content-Type' відповіді як 'text/plain',
  // бо ми все одне - нічого не повертаємо з функціі
  res.setHeader('Content-Type', 'text/plain')

  // ! Перевіряємо, чи є тип вмісту запиту 'application/json'
  if (req.headers['content-type'] === 'application/json') {
    let dataJSON = ''

    req.on('data', (chunk) => dataJSON += chunk)

    // ! Коли дані припиняють надходити, ми спробуємо їх розібрати як JSON і додати до нашого списку завдань
    req.on('end', () => {
      try {
        todos.push(JSON.parse(dataJSON))
        res.statusCode = 200
        res.end('Todo data was received')
      } catch (err) {
        // ! Якщо дані не можуть бути розібрані як JSON, відправляємо помилку 400
        res.statusCode = 400
        res.end('Invalid JSON')
      }
    })
  } else {
    // ! Якщо тип вмісту запиту не є 'application/json', відправляємо помилку 400
    res.statusCode = 400
    res.end('Todo data must be in JSON format')
  }
}

/*
 ! Перевіряємо роботу кода.
 ! Якщо JSON невалідний, в постмані побачимо:
   Invalid JSON.
   Status: 400 Bad Request
 ! Якщо буде обраний інший формат надсилання данних, в постмані побачимо:
   T0do data must be in JSON format
   Status: 400 Bad Request
 * код працює коректно
*/

const generate404 = (req, res) => {
  res.statusCode = 404
  res.setHeader('Content-Type', 'text/html')
  res.end(notFoundTemplate)
}

export { generateHTML, generateText, generateJSON, generate404, postData }
