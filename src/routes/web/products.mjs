import { Router } from 'express'
import {
  getProducts,
  getProduct,
  getNewProductForm,
  getEditProductForm,
  createProduct,
  updateProductHandler,
  deleteProductHandler
} from '../../controllers/productController.mjs'
import { validateObjectIdParam } from '../../middleware/validation.mjs'
import { requireAuth } from '../../middleware/auth.mjs'

const router = Router()

// Перегляд списку продуктів - публічний доступ
router.route('/').get(getProducts).post(requireAuth, createProduct)

// Форма створення нового продукту - тільки для авторизованих
router.route('/new').get(requireAuth, getNewProductForm)

// Перегляд окремого продукту - публічний доступ
// Редагування та видалення - тільки для авторизованих
router
  .route('/:id')
  .all(validateObjectIdParam())
  .get(getProduct)
  .put(requireAuth, updateProductHandler)
  .delete(requireAuth, deleteProductHandler)

// Форма редагування продукту - тільки для авторизованих
router.route('/:id/edit').all(validateObjectIdParam()).get(requireAuth, getEditProductForm)

export default router
