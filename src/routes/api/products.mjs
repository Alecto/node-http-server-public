import { Router } from 'express'
import {
  getProductsAPI,
  getProductAPI,
  createProductAPI,
  updateProductAPI,
  deleteProductAPI
} from '../../controllers/productController.mjs'

const router = Router()

// /api/products
router
  .route('/')
  .get(getProductsAPI) // GET /api/products - отримати всі продукти
  .post(createProductAPI) // POST /api/products - створити новий продукт

// /api/products/:id
router
  .route('/:id')
  .get(getProductAPI) // GET /api/products/:id - отримати продукт за ID
  .put(updateProductAPI) // PUT /api/products/:id - повне оновлення продукту
  .patch(updateProductAPI) // PATCH /api/products/:id - часткове оновлення продукту
  .delete(deleteProductAPI) // DELETE /api/products/:id - видалити продукт

export default router
