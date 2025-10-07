import mongoose from 'mongoose'

const buildErrorResponse = (res, message) => {
  return res.status(400).json({ success: false, error: message })
}

const sanitizeString = (value) => (typeof value === 'string' ? value.trim() : '')

const validateFields = ({ name, price, description }, { partial = false } = {}) => {
  const errors = []
  const payload = {}

  if (name !== undefined || !partial) {
    const sanitizedName = sanitizeString(name)
    if (sanitizedName.length < 2 || sanitizedName.length > 120) {
      errors.push('Поле name повинно містити від 2 до 120 символів')
    } else {
      payload.name = sanitizedName
    }
  }

  if (price !== undefined || !partial) {
    const numericPrice = Number(price)
    if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
      errors.push('Поле price повинно бути додатнім числом')
    } else {
      payload.price = numericPrice
    }
  }

  if (description !== undefined || !partial) {
    const sanitizedDescription = sanitizeString(description)
    if (sanitizedDescription.length < 5 || sanitizedDescription.length > 500) {
      errors.push('Поле description повинно містити від 5 до 500 символів')
    } else {
      payload.description = sanitizedDescription
    }
  }

  return { errors, payload }
}

export const validateProductCreateRequest = (req, res, next) => {
  const { errors, payload } = validateFields(req.body, { partial: false })

  if (errors.length > 0) {
    return buildErrorResponse(res, errors.join('. '))
  }

  req.validatedProduct = payload
  next()
}

export const validateProductPutRequest = (req, res, next) => {
  const { errors, payload } = validateFields(req.body, { partial: false })

  if (errors.length > 0) {
    return buildErrorResponse(res, errors.join('. '))
  }

  req.validatedProduct = payload
  next()
}

export const validateProductPatchRequest = (req, res, next) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return buildErrorResponse(res, 'Передайте хоча б одне поле для оновлення')
  }

  const { errors, payload } = validateFields(req.body, { partial: true })

  if (errors.length > 0) {
    return buildErrorResponse(res, errors.join('. '))
  }

  if (Object.keys(payload).length === 0) {
    return buildErrorResponse(res, 'Передайте хоча б одне поле для оновлення')
  }

  req.validatedProductUpdates = payload
  next()
}

const handleInvalidObjectIdResponse = (req, res) => {
  if (req.originalUrl.startsWith('/api/')) {
    return res.status(400).json({ success: false, error: 'Некоректний ідентифікатор ресурсу' })
  }

  return res.status(404).render('errors/404')
}

export const validateObjectIdParam =
  (paramName = 'id') =>
  (req, res, next) => {
    const value = req.params[paramName]

    if (!value || !mongoose.isValidObjectId(value)) {
      return handleInvalidObjectIdResponse(req, res)
    }

    next()
  }
