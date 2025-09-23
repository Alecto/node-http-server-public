import { Router } from 'express'
import pagesRouter from './pages.mjs'
import productsRouter from './products.mjs'

const web = Router()

// Підключення роутерів
web.use('/', pagesRouter) // Головна сторінка та загальні маршрути
web.use('/products', productsRouter) // Products Web Interface

export default web
