import { Router } from 'express'
import productsRouter from './products.mjs'

const router = Router()

router.use('/products', productsRouter)

router.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'API endpoint not found',
    path: req.originalUrl
  })
})

export default router
