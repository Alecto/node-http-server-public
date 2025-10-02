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
  validateProductPatchRequest
} from '../../middleware/validation.mjs'

const router = Router()

// /api/products
router
  .route('/')
  .get(getProductsAPI) // GET /api/products - отримати всі продукти
  .post(validateProductCreateRequest, createProductAPI) // POST /api/products - створити новий продукт

// /api/products/:id
router
  .route('/:id')
  .get(getProductAPI) // GET /api/products/:id - отримати продукт за ID
  .put(validateProductPutRequest, replaceProductAPI) // PUT /api/products/:id - повне оновлення продукту
  .patch(validateProductPatchRequest, updateProductAPI) // PATCH /api/products/:id - часткове оновлення продукту
  .delete(deleteProductAPI) // DELETE /api/products/:id - видалити продукт

export default router
