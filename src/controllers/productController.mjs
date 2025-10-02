import { ProductModel } from '../models/products.mjs'
import * as logger from '../utils/logger.mjs'

// ============ JSON API ENDPOINTS ============

export const getProductsAPI = async (req, res, next) => {
  try {
    const products = await ProductModel.find().sort({ createdAt: -1 }).lean({ virtuals: true })
    const total = await ProductModel.countDocuments()
    logger.debug('getProductsAPI', { returned: products.length, total })
    res.status(200).json({ success: true, data: products, count: products.length, total })
  } catch (error) {
    next(error)
  }
}

export const getProductAPI = async (req, res, next) => {
  try {
    const product = await ProductModel.findById(req.params.id).lean({ virtuals: true })

    if (!product) {
      return res.status(404).json({ success: false, error: 'Продукт не знайдено' })
    }

    res.status(200).json({ success: true, data: product })
  } catch (error) {
    next(error)
  }
}

export const createProductAPI = async (req, res, next) => {
  try {
    const product = await ProductModel.create({
      name: req.validatedProduct.name,
      price: req.validatedProduct.price,
      description: req.validatedProduct.description
    })

    res.status(201).json({ success: true, data: product.toJSON(), message: 'Продукт успішно створено' })
  } catch (error) {
    next(error)
  }
}

export const replaceProductAPI = async (req, res, next) => {
  try {
    const product = await ProductModel.findByIdAndUpdate(req.params.id, req.validatedProduct, {
      new: true,
      runValidators: true
    }).lean({ virtuals: true })

    if (!product) {
      return res.status(404).json({ success: false, error: 'Продукт не знайдено' })
    }

    res.status(200).json({ success: true, data: product, message: 'Продукт успішно оновлено' })
  } catch (error) {
    next(error)
  }
}

export const updateProductAPI = async (req, res, next) => {
  try {
    const product = await ProductModel.findByIdAndUpdate(req.params.id, req.validatedProductUpdates, {
      new: true,
      runValidators: true
    }).lean({ virtuals: true })

    if (!product) {
      return res.status(404).json({ success: false, error: 'Продукт не знайдено' })
    }

    res.status(200).json({ success: true, data: product, message: 'Продукт успішно оновлено' })
  } catch (error) {
    next(error)
  }
}

export const deleteProductAPI = async (req, res, next) => {
  try {
    const product = await ProductModel.findByIdAndDelete(req.params.id).lean({ virtuals: true })

    if (!product) {
      return res.status(404).json({ success: false, error: 'Продукт не знайдено' })
    }

    res.status(200).json({ success: true, data: product, message: 'Продукт успішно видалено' })
  } catch (error) {
    next(error)
  }
}

// ============ HTML WEB ENDPOINTS ============

export const getProducts = async (req, res, next) => {
  try {
    const products = await ProductModel.find().sort({ createdAt: -1 }).lean({ virtuals: true })
    const total = await ProductModel.countDocuments()
    logger.debug('getProducts.view', { returned: products.length, total })
    res.render('products', { products, total })
  } catch (error) {
    next(error)
  }
}

export const getProduct = async (req, res, next) => {
  try {
    const product = await ProductModel.findById(req.params.id)

    if (!product) {
      return res.status(404).render('404')
    }

    res.render('product-detail', { product })
  } catch (error) {
    next(error)
  }
}

export const getNewProductForm = (req, res) => {
  res.render('product-form', { product: {}, isEdit: false })
}

export const getEditProductForm = async (req, res, next) => {
  try {
    const product = await ProductModel.findById(req.params.id)

    if (!product) {
      return res.status(404).render('404')
    }

    res.render('product-form', { product, isEdit: true })
  } catch (error) {
    next(error)
  }
}

export const createProduct = async (req, res, next) => {
  try {
    await ProductModel.create({
      name: String(req.body.name || '').trim(),
      price: Number(req.body.price),
      description: String(req.body.description || '').trim()
    })

    res.redirect('/products')
  } catch (error) {
    logger.error('Помилка при створенні продукту:', error)
    res.status(400).render('product-form', {
      product: req.body,
      isEdit: false,
      error: 'Не вдалося створити продукт. Перевірте всі поля.'
    })
  }
}

export const updateProductHandler = async (req, res, next) => {
  try {
    const product = await ProductModel.findByIdAndUpdate(
      req.params.id,
      {
        name: String(req.body.name || '').trim(),
        price: Number(req.body.price),
        description: String(req.body.description || '').trim()
      },
      { new: true, runValidators: true }
    )

    if (!product) {
      return res.status(404).render('404')
    }

    res.redirect('/products')
  } catch (error) {
    logger.error('Помилка при оновленні продукту:', error)
    res.status(400).render('product-form', {
      product: { ...req.body, id: req.params.id },
      isEdit: true,
      error: 'Не вдалося оновити продукт. Перевірте всі поля.'
    })
  }
}

export const deleteProductHandler = async (req, res, next) => {
  try {
    const product = await ProductModel.findByIdAndDelete(req.params.id)

    if (!product) {
      return res.status(404).render('404')
    }

    res.redirect('/products')
  } catch (error) {
    next(error)
  }
}
