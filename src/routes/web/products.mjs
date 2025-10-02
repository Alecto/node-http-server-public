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

const router = Router()

router.route('/').get(getProducts).post(createProduct)

router.route('/new').get(getNewProductForm)

router.route('/:id').all(validateObjectIdParam()).get(getProduct).put(updateProductHandler).delete(deleteProductHandler)

router.route('/:id/edit').all(validateObjectIdParam()).get(getEditProductForm)

export default router
