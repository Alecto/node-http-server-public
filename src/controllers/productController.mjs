import { products, addProduct, getProductById } from '../models/products.mjs'

export const getHomePage = (req, res) => {
  res.render('index')
}

export const getProducts = (req, res) => {
  res.render('products', { products })
}

export const getNewProductForm = (req, res) => {
  res.render('product-form')
}

export const getProduct = (req, res) => {
  const product = getProductById(req.params.id)

  if (!product) {
    return res.status(404).send('Продукт не знайдено')
  }

  res.render('product-detail', { product })
}

export const createProduct = (req, res) => {
  const { name, price, description } = req.body

  if (!name || !price || !description) {
    return res.status(400).send('Всі поля обовʼязкові')
  }

  const product = addProduct({ name, price: Number(price), description })

  res.redirect(`/products/${product.id}`)
}
