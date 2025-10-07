import { Router } from 'express'
import { showProfile, getCurrentUser, generateAPIToken, getAllUsers } from '../../controllers/authController.mjs'
import { requireAuth, verifyJWT, optionalJWT } from '../../middleware/auth.mjs'
import { AUTH0_CONFIG } from '../../config/auth.mjs'

const router = Router()

/**
 * Auth0 автоматично обробляє ці роути через express-openid-connect:
 * - GET /auth/login - редирект на Auth0
 * - GET /auth/logout - вихід з системи
 * - GET /auth/callback - callback після автентифікації
 *
 * Збереження користувача в БД відбувається через middleware в server.mjs
 */

// Fallback маршрути, якщо Auth0 вимкнено
if (!AUTH0_CONFIG.ENABLED) {
  router.get('/login', (req, res) => {
    res.status(503).render('auth/disabled')
  })

  router.get('/logout', (req, res) => {
    res.redirect('/')
  })

  router.get('/callback', (req, res) => {
    res.redirect('/auth/login')
  })
}

// Профіль користувача (веб-сторінка)
router.get('/profile', requireAuth, showProfile)

// API ендпоінти
router.get('/api/me', optionalJWT, getCurrentUser)

// Генерація JWT токена для API доступу
router.get('/api/token', requireAuth, generateAPIToken)

// Список користувачів (захищений, тільки для авторизованих)
router.get('/api/users', verifyJWT, getAllUsers)

export default router
