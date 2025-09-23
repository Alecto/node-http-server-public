import { Router } from 'express'
import productsRouter from './products.mjs'

const api = Router()

// API routes
api.use('/products', productsRouter)

// Middleware для 404 у API (JSON відповідь)
api.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'API endpoint not found',
    path: req.originalUrl
  })
})

export default api
