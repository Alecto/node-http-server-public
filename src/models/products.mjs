import { Schema, model } from 'mongoose'

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120
    },
    price: {
      type: Number,
      required: true,
      min: 0.01
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 500
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

productSchema.index(
  { name: 1 },
  { unique: true, name: 'product_name_case_insensitive', collation: { locale: 'en', strength: 2 } }
)
productSchema.index({ createdAt: -1 })

productSchema.set('toJSON', {
  virtuals: true,
  transform: (_, ret) => {
    ret.id = ret._id
    delete ret._id
    return ret
  }
})

export const ProductModel = model('Product', productSchema)
