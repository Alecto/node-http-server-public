/*
 ? Головний файл для запуску сервера
*/

import { app, startServer } from './src/server.mjs'

// Для локального запуску
if (process.env.VERCEL !== '1') {
  startServer()
}

// Для Vercel serverless - експортуємо app
// Ініціалізація відбувається автоматично через middleware при першому запиті
export default app
