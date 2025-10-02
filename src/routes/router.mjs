import { Router } from 'express'
import {
  getHomePage,
  getProducts,
  getNewProductForm,
  getProduct,
  createProduct
} from '../controllers/productController.mjs'

const router = Router()

router.route('/').get(getHomePage)

router.route('/products').get(getProducts).post(createProduct)

router.route('/products/new').get(getNewProductForm)

router.route('/products/:id').get(getProduct)

export const setupRoutes = (app) => {
  app.use('/', router)

  app.use((req, res) => {
    res.status(404).send('Сторінку не знайдено')
  })
}
