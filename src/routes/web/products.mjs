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

const router = Router()

router.route('/').get(getProducts).post(createProduct)

router.route('/new').get(getNewProductForm)

router.route('/:id').get(getProduct).put(updateProductHandler).delete(deleteProductHandler)

router.route('/:id/edit').get(getEditProductForm)

export default router
