import { Router } from 'express'
import { getHomePage } from '../../controllers/pageController.mjs'

const router = Router()

// Головна сторінка
router.route('/').get(getHomePage) // GET / - головна сторінка

// Підтримка старих маршрутів для сумісності
router.get('/form', (req, res) => res.redirect('/products/new'))

export default router
