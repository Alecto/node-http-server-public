import fs from 'fs/promises'

const createHTMLTemplate = (htmlInjection) => `
    <!DOCTYPE html>
    <html lang='en'>
    
    <head>
      <meta charset='UTF-8'>
      <meta name='viewport' content='width=device-width, initial-scale=1.0'>
      <title>HTTP server</title>
    </head>
    
    <body style='font-family: Arial, sans-serif'>
      <div style='width: min(100% - 40px, 992px); margin-inline: auto;'>
          ${htmlInjection}
      </div>  
    </body>
    
    </html>
    `

const rootHtmlTemplate = createHTMLTemplate('<h1>Hello from HTTP server</h1><a href="/form">Form</a>&nbsp;<a href="/todos">Todos</a>')

const notFoundTemplate = createHTMLTemplate('<h1>404 - Page not found</h1>')

// start formTemplate
let formTemplate

const loadFormTemplate = async () => {
  try {
    formTemplate = await fs.readFile('./templates/form.html')
  } catch (err) {
    console.error('File read error:', err)
  }
}

loadFormTemplate().catch(console.log)
// end formTemplate

const generateTodosTemplate = () => {
  // Перетворюємо кожне завдання в HTML-рядок
  const todosHTML = todos.map(todo => `
    <div>
      <h2>${todo.title}</h2>
      <p>User ID: ${todo.userId}</p>
      <p>ID: ${todo.id}</p>
      <p>Completed: ${todo.completed ? 'Yes' : 'No'}</p>
    </div>
  `).join('')

  // Додаємо кнопку для переходу на сторінку /form
  const buttonHTML = `<button onclick="location.href='/form'" type='button'>Submit one more todo</button>`

  // Вставляємо HTML-рядки завдань і кнопку в шаблон сторінки
  return createHTMLTemplate(`${todosHTML}${buttonHTML}`)
}

const todos = [
  {
    userId: 1,
    id: 1,
    title: 'delectus aut autem',
    completed: false
  },
  {
    userId: 1,
    id: 2,
    title: 'quis ut nam facilis et officia qui',
    completed: false
  },
  {
    userId: 1,
    id: 3,
    title: 'fugiat veniam minus',
    completed: false
  },
  {
    userId: 1,
    id: 4,
    title: 'et porro tempora',
    completed: true
  },
  {
    userId: 1,
    id: 5,
    title: 'laboriosam mollitia et enim quasi adipisci quia provident illum',
    completed: false
  }
]

export { rootHtmlTemplate, notFoundTemplate, formTemplate, generateTodosTemplate, todos }
