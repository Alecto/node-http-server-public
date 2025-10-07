import { UserModel } from '../models/user.mjs'
import { generateJWT } from '../middleware/auth.mjs'
import { JWT_CONFIG } from '../config/auth.mjs'
import * as logger from '../utils/logger.mjs'

/**
 * Отримання профілю поточного користувача
 */
export const getCurrentUser = async (req, res, next) => {
  try {
    // Для веб-інтерфейсу
    if (req.oidc && req.oidc.isAuthenticated()) {
      const { user: auth0User } = req.oidc
      const user = await UserModel.findOne({ auth0Id: auth0User.sub })

      if (!user) {
        logger.error('Користувач не знайдений в БД', { auth0Id: auth0User.sub })
        return res.status(404).json({
          success: false,
          error: 'Користувач не знайдений'
        })
      }

      return res.json({
        success: true,
        data: user.toJSON()
      })
    }

    // Для API з JWT
    if (req.auth && req.auth.userId) {
      const user = await UserModel.findById(req.auth.userId)

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'Користувач не знайдений'
        })
      }

      return res.json({
        success: true,
        data: user.toJSON()
      })
    }

    return res.status(401).json({
      success: false,
      error: 'Не автентифіковано'
    })
  } catch (error) {
    logger.error('Помилка в getCurrentUser:', error)
    next(error)
  }
}

/**
 * Генерація JWT токена для API доступу
 */
export const generateAPIToken = async (req, res, next) => {
  try {
    if (!req.oidc || !req.oidc.isAuthenticated()) {
      return res.status(401).json({
        success: false,
        error: 'Необхідна автентифікація',
        message: 'Спочатку авторизуйтесь через веб-інтерфейс'
      })
    }

    const { user: auth0User } = req.oidc
    const user = await UserModel.findOne({ auth0Id: auth0User.sub })

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Користувач не знайдений'
      })
    }

    // Генеруємо JWT токен
    const token = generateJWT(user)

    logger.info('JWT токен згенеровано', { userId: user._id, email: user.email })

    return res.json({
      success: true,
      data: {
        token,
        expiresIn: JWT_CONFIG.EXPIRES_IN,
        tokenType: 'Bearer'
      },
      message: 'JWT токен успішно згенеровано'
    })
  } catch (error) {
    logger.error('Помилка в generateAPIToken:', error)
    next(error)
  }
}

/**
 * Відображення сторінки профілю користувача
 */
export const showProfile = async (req, res, next) => {
  try {
    if (!req.oidc || !req.oidc.isAuthenticated()) {
      return res.redirect('/auth/login')
    }

    const { user: auth0User } = req.oidc
    const user = await UserModel.findOne({ auth0Id: auth0User.sub })

    if (!user) {
      logger.error('Користувач не знайдений в БД', { auth0Id: auth0User.sub })
      return res.status(404).render('404')
    }

    res.render('profile', { user: user.toJSON() })
  } catch (error) {
    logger.error('Помилка в showProfile:', error)
    next(error)
  }
}

/**
 * Список всіх користувачів (для адміністрування)
 */
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await UserModel.find().sort({ createdAt: -1 }).lean({ virtuals: true })
    const total = await UserModel.countDocuments()

    logger.debug('getAllUsers', { returned: users.length, total })

    res.json({
      success: true,
      data: users,
      count: users.length,
      total
    })
  } catch (error) {
    logger.error('Помилка в getAllUsers:', error)
    next(error)
  }
}
