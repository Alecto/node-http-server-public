// HTTP статус коди
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
}

// Типи контенту
export const CONTENT_TYPE = {
  TEXT: 'text/plain; charset=utf-8',
  HTML: 'text/html; charset=utf-8',
  JSON: 'application/json; charset=utf-8',
  FORM: 'application/x-www-form-urlencoded'
}

/**
 * Технічні шляхи, які автоматично генерують браузери та інструменти розробника
 * Ці запити логуються тільки на debug рівні для зменшення шуму в консолі
 *
 * Можна налаштувати через змінну оточення TECHNICAL_PATHS (розділені комами)
 * Приклад: TECHNICAL_PATHS=/.well-known/,/favicon.ico,/robots.txt
 */
export const TECHNICAL_PATHS = process.env.TECHNICAL_PATHS
  ? process.env.TECHNICAL_PATHS.split(',').map((path) => path.trim())
  : [
      '/.well-known/', // Chrome DevTools, метадані браузерів
      '/favicon.ico', // Іконка сайту
      '/robots.txt', // Інструкції для пошукових роботів
      '/sitemap.xml', // Карта сайту
      '/apple-touch-icon', // Іконки для iOS/Safari
      '/browserconfig.xml' // Конфігурація для Windows
    ]
