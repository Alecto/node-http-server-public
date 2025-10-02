import { Router } from 'express'
import pagesRouter from './pages.mjs'
import productsRouter from './products.mjs'

const web = Router()

web.use('/', pagesRouter)
web.use('/products', productsRouter)

export default web
