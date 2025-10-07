import { Router } from 'express'
import {
  getProductsAPI,
  getProductAPI,
  createProductAPI,
  replaceProductAPI,
  updateProductAPI,
  deleteProductAPI
} from '../../controllers/productController.mjs'
import {
  validateProductCreateRequest,
  validateProductPutRequest,
  validateProductPatchRequest,
  validateObjectIdParam
} from '../../middleware/validation.mjs'
import { verifyJWT, optionalJWT } from '../../middleware/auth.mjs'

const router = Router()

// Перегляд списку продуктів - публічний доступ (опціональний JWT)
// Створення продукту - тільки для авторизованих через JWT
router.route('/').get(optionalJWT, getProductsAPI).post(verifyJWT, validateProductCreateRequest, createProductAPI)

// Перегляд окремого продукту - публічний доступ (опціональний JWT)
// Редагування та видалення - тільки для авторизованих через JWT
router
  .route('/:id')
  .all(validateObjectIdParam())
  .get(optionalJWT, getProductAPI)
  .put(verifyJWT, validateProductPutRequest, replaceProductAPI)
  .patch(verifyJWT, validateProductPatchRequest, updateProductAPI)
  .delete(verifyJWT, deleteProductAPI)

export default router
