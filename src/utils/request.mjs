// Функція для читання тіла запиту
export const readRequestBody = async (req) => {
  return new Promise((resolve, reject) => {
    let body = ''
    req.on('data', (chunk) => {
      body += chunk.toString()
    })
    req.on('end', () => resolve(body))
    req.on('error', (err) => reject(err))
  })
}

/**
 * Функція для парсингу параметрів запиту з URL
 * Приклад використання:
 * const url = '/users?name=John&age=25'
 * const params = parseQueryParams(url) // { name: 'John', age: '25' }
 *
 * @param {string} url - URL з параметрами запиту
 * @returns {Object} - Об'єкт з розпарсеними параметрами
 */
export const parseQueryParams = (url) => {
  // Розділяємо URL на базовий шлях та рядок запиту
  const [, queryString] = url.split('?')
  if (!queryString) return {}

  // Перетворюємо рядок запиту на об'єкт з параметрами
  return queryString.split('&').reduce((params, param) => {
    const [key, value] = param.split('=')
    // Декодуємо значення, щоб коректно обробити спеціальні символи та UTF-8
    params[key] = value ? decodeURIComponent(value) : ''
    return params
  }, {})
}
