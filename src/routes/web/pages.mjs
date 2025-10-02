import { Router } from 'express'
import { getHomePage } from '../../controllers/pageController.mjs'

const router = Router()

router.route('/').get(getHomePage)

router.route('/form').get((req, res) => res.redirect('/products/new'))

export default router
