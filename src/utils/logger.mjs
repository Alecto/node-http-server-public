// Рівні логування
const LOG_LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3
}

// Поточний рівень логування (з змінної оточення або за замовчуванням)
const currentLevel = LOG_LEVELS[process.env.LOG_LEVEL?.toLowerCase()] ?? LOG_LEVELS.info

// Базова функція для форматування повідомлень
const formatMessage = (level, message, data = null) => {
  const timestamp = new Date().toISOString()
  const levelPrefix = level !== 'info' ? `[${level.toUpperCase()}] ` : ''
  const logMessage = `[${timestamp}] ${levelPrefix}${message}`

  return { logMessage, data }
}

// Функція для логування
export const log = (message, data = null) => {
  const { logMessage, data: logData } = formatMessage('info', message, data)

  if (logData) {
    console.log(logMessage, logData)
  } else {
    console.log(logMessage)
  }
}

// Функція для логування помилок
export const error = (message, error = null) => {
  if (currentLevel < LOG_LEVELS.error) return

  const { logMessage, data: logData } = formatMessage('error', message, error)

  if (logData) {
    console.error(logMessage, logData)
  } else {
    console.error(logMessage)
  }
}

// Функція для попереджень
export const warn = (message, data = null) => {
  if (currentLevel < LOG_LEVELS.warn) return

  const { logMessage, data: logData } = formatMessage('warn', message, data)

  if (logData) {
    console.warn(logMessage, logData)
  } else {
    console.warn(logMessage)
  }
}

// Функція для інформаційних повідомлень
export const info = (message, data = null) => {
  if (currentLevel < LOG_LEVELS.info) return

  const { logMessage, data: logData } = formatMessage('info', message, data)

  if (logData) {
    console.log(logMessage, logData)
  } else {
    console.log(logMessage)
  }
}

// Функція для debug повідомлень (показується тільки при LOG_LEVEL=debug)
export const debug = (message, data = null) => {
  if (currentLevel < LOG_LEVELS.debug) return

  const { logMessage, data: logData } = formatMessage('debug', message, data)

  if (logData) {
    console.log(logMessage, logData)
  } else {
    console.log(logMessage)
  }
}
