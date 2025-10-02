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

const router = Router()

router.route('/').get(getProductsAPI).post(validateProductCreateRequest, createProductAPI)

router
  .route('/:id')
  .all(validateObjectIdParam())
  .get(getProductAPI)
  .put(validateProductPutRequest, replaceProductAPI)
  .patch(validateProductPatchRequest, updateProductAPI)
  .delete(deleteProductAPI)

export default router
