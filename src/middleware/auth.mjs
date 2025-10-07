import jwt from 'jsonwebtoken'
import { JWT_CONFIG } from '../config/auth.mjs'
import * as logger from '../utils/logger.mjs'

// Регулярний вираз для валідації Bearer токена
const BEARER_TOKEN_REGEX = /^Bearer\s+([A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+)$/

/**
 * Middleware для перевірки автентифікації користувача (для web роутів)
 * Перевіряє чи користувач залогінений через Auth0 session
 */
export const requireAuth = (req, res, next) => {
  // Перевіряємо чи є користувач в сесії (встановлюється Auth0)
  if (req.oidc && req.oidc.isAuthenticated()) {
    return next()
  }

  // Для API запитів повертаємо JSON
  if (req.path.startsWith('/api/')) {
    return res.status(401).json({
      success: false,
      error: 'Необхідна автентифікація',
      message: 'Для доступу до цього ресурсу потрібно авторизуватися'
    })
  }

  // Для web запитів редиректимо на сторінку логіну
  logger.warn(`Неавторизований доступ до: ${req.originalUrl}`)
  return res.redirect('/auth/login')
}

/**
 * Опціональна автентифікація - не блокує запит, але додає інформацію про користувача
 */
export const optionalAuth = (req, res, next) => {
  // Auth0 middleware вже додає req.oidc
  // Просто передаємо далі
  next()
}

/**
 * Middleware для перевірки JWT токена (для API роутів)
 * Очікує токен в Authorization header: "Bearer <token>"
 */
export const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      error: 'Токен відсутній',
      message: 'Необхідно надати JWT токен в Authorization header'
    })
  }

  // Валідація формату Bearer токена
  const match = authHeader.match(BEARER_TOKEN_REGEX)
  if (!match) {
    return res.status(401).json({
      success: false,
      error: 'Невірний формат токена',
      message: 'Authorization header повинен мати формат: Bearer <token>'
    })
  }

  const token = match[1]

  // Додаткова перевірка довжини токена
  if (token.length > 2048) {
    return res.status(401).json({
      success: false,
      error: 'Токен занадто довгий',
      message: 'JWT токен перевищує максимально допустиму довжину'
    })
  }

  try {
    // Верифікуємо токен з суворими налаштуваннями
    const decoded = jwt.verify(token, JWT_CONFIG.SECRET, {
      algorithms: [JWT_CONFIG.ALGORITHM],
      clockTolerance: 30, // Допустима різниця в часі (30 секунд)
      complete: false,
      issuer: 'node-products-server',
      audience: 'node-products-api'
    })

    // Валідація обов'язкових полів
    if (!decoded.userId || !decoded.email) {
      throw new jwt.JsonWebTokenError('Токен не містить необхідних полів')
    }

    // Додаємо інформацію про користувача в req
    req.user = decoded
    req.auth = {
      userId: decoded.userId,
      email: decoded.email,
      auth0Id: decoded.auth0Id
    }

    logger.debug('JWT токен верифіковано', { userId: decoded.userId })
    next()
  } catch (error) {
    // Не логуємо сам токен з міркувань безпеки
    logger.warn('Помилка верифікації JWT токена', {
      error: error.name,
      message: error.message
    })

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Токен прострочений',
        message: 'JWT токен більше не дійсний. Будь ласка, отримайте новий токен'
      })
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Невірний токен',
        message: 'JWT токен недійсний або пошкоджений'
      })
    }

    if (error.name === 'NotBeforeError') {
      return res.status(401).json({
        success: false,
        error: 'Токен ще не активний',
        message: 'JWT токен ще не можна використовувати'
      })
    }

    return res.status(500).json({
      success: false,
      error: 'Помилка автентифікації',
      message: 'Не вдалося верифікувати токен'
    })
  }
}

/**
 * Опціональна JWT автентифікація - не блокує запит при відсутності токена
 */
export const optionalJWT = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return next()
  }

  const match = authHeader.match(BEARER_TOKEN_REGEX)
  if (!match) {
    return next()
  }

  const token = match[1]

  // Перевірка довжини
  if (token.length > 2048) {
    return next()
  }

  try {
    const decoded = jwt.verify(token, JWT_CONFIG.SECRET, {
      algorithms: [JWT_CONFIG.ALGORITHM],
      clockTolerance: 30,
      issuer: 'node-products-server',
      audience: 'node-products-api'
    })

    // Валідація обов'язкових полів
    if (decoded.userId && decoded.email) {
      req.user = decoded
      req.auth = {
        userId: decoded.userId,
        email: decoded.email,
        auth0Id: decoded.auth0Id
      }

      logger.debug('JWT токен верифіковано (опціональний)', { userId: decoded.userId })
    }
  } catch (error) {
    // Тихо ігноруємо помилки для опціонального middleware
    logger.debug('Невдала опціональна верифікація JWT токена', { error: error.name })
  }

  next()
}

/**
 * Генерація JWT токена для користувача
 */
export const generateJWT = (user) => {
  // Валідація вхідних даних
  if (!user || !user._id || !user.email || !user.auth0Id) {
    throw new Error('Неповні дані користувача для генерації JWT токена')
  }

  const now = Math.floor(Date.now() / 1000)

  const payload = {
    userId: user._id.toString(),
    email: user.email,
    name: user.name,
    auth0Id: user.auth0Id,
    // Додаткові claim для безпеки
    iat: now, // Час видачі
    nbf: now // Не раніше ніж (not before)
  }

  const token = jwt.sign(payload, JWT_CONFIG.SECRET, {
    expiresIn: JWT_CONFIG.EXPIRES_IN,
    algorithm: JWT_CONFIG.ALGORITHM,
    // Додаткові опції для безпеки
    issuer: 'node-products-server', // Ідентифікатор видавця
    audience: 'node-products-api' // Цільова аудиторія
  })

  return token
}
