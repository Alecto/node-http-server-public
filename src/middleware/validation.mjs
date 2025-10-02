import { validatePatchProduct, validatePutProduct } from '../models/products.mjs'

const buildErrorResponse = (res, message) => {
  return res.status(400).json({
    success: false,
    error: message
  })
}

export const validateProductCreateRequest = (req, res, next) => {
  const payload = {
    name: typeof req.body?.name === 'string' ? req.body.name.trim() : '',
    price: Number(req.body?.price),
    description: typeof req.body?.description === 'string' ? req.body.description.trim() : ''
  }

  if (!validatePutProduct(payload)) {
    return buildErrorResponse(res, 'Невірні дані продукту: перевірте name, price та description')
  }

  req.validatedProduct = payload
  next()
}

export const validateProductPutRequest = (req, res, next) => {
  const payload = {
    name: typeof req.body?.name === 'string' ? req.body.name.trim() : '',
    price: Number(req.body?.price),
    description: typeof req.body?.description === 'string' ? req.body.description.trim() : ''
  }

  if (!validatePutProduct(payload)) {
    return buildErrorResponse(res, 'Невірні дані продукту: перевірте name, price та description')
  }

  req.validatedProduct = payload
  next()
}

export const validateProductPatchRequest = (req, res, next) => {
  const updates = {}

  if ('name' in req.body) {
    updates.name = typeof req.body.name === 'string' ? req.body.name.trim() : req.body.name
  }

  if ('price' in req.body) {
    updates.price = Number(req.body.price)
  }

  if ('description' in req.body) {
    updates.description = typeof req.body.description === 'string' ? req.body.description.trim() : req.body.description
  }

  if (!validatePatchProduct(updates)) {
    return buildErrorResponse(res, 'Невірні дані продукту: перевірте name, price та description')
  }

  req.validatedProductUpdates = updates
  next()
}
