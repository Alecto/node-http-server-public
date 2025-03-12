import 'dotenv/config'

// Конфігурація сервера
export const SERVER_CONFIG = {
  PORT: process.env.PORT || 3000,
  HOST: process.env.HOST || 'localhost'
}

// Шляхи до файлів
export const FILE_PATHS = {
  TEMPLATES_DIR: './src/views',
  FORM_TEMPLATE: './src/views/form.html'
} 
