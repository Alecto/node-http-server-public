import jwt from 'jsonwebtoken'
import { JWT_CONFIG } from '../config/auth.mjs'
import * as logger from '../utils/logger.mjs'

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

  // Перевіряємо формат: "Bearer <token>"
  const parts = authHeader.split(' ')
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({
      success: false,
      error: 'Невірний формат токена',
      message: 'Authorization header повинен мати формат: Bearer <token>'
    })
  }

  const token = parts[1]

  try {
    // Верифікуємо токен
    const decoded = jwt.verify(token, JWT_CONFIG.SECRET, {
      algorithms: [JWT_CONFIG.ALGORITHM]
    })

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
    logger.error('Помилка верифікації JWT токена:', error)

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

  const parts = authHeader.split(' ')
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return next()
  }

  const token = parts[1]

  try {
    const decoded = jwt.verify(token, JWT_CONFIG.SECRET, {
      algorithms: [JWT_CONFIG.ALGORITHM]
    })

    req.user = decoded
    req.auth = {
      userId: decoded.userId,
      email: decoded.email,
      auth0Id: decoded.auth0Id
    }

    logger.debug('JWT токен верифіковано (опціональний)', { userId: decoded.userId })
  } catch (error) {
    logger.debug('Невдала опціональна верифікація JWT токена:', error.message)
  }

  next()
}

/**
 * Генерація JWT токена для користувача
 */
export const generateJWT = (user) => {
  const payload = {
    userId: user._id.toString(),
    email: user.email,
    name: user.name,
    auth0Id: user.auth0Id
  }

  const token = jwt.sign(payload, JWT_CONFIG.SECRET, {
    expiresIn: JWT_CONFIG.EXPIRES_IN,
    algorithm: JWT_CONFIG.ALGORITHM
  })

  return token
}
