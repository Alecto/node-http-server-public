import { Schema, model } from 'mongoose'

const userSchema = new Schema(
  {
    auth0Id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    picture: {
      type: String,
      trim: true
    },
    provider: {
      type: String,
      enum: ['google-oauth2', 'github', 'auth0', 'facebook', 'twitter'],
      default: 'auth0'
    },
    lastLogin: {
      type: Date,
      default: Date.now
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

// Індекс для швидкого пошуку за email
userSchema.index({ email: 1 })

// Індекс для auth0Id (унікальний)
userSchema.index({ auth0Id: 1 }, { unique: true })

// Метод для оновлення останнього входу
userSchema.methods.updateLastLogin = function () {
  this.lastLogin = new Date()
  return this.save()
}

// Трансформація при серіалізації в JSON
userSchema.set('toJSON', {
  virtuals: true,
  transform: (_, ret) => {
    ret.id = ret._id
    delete ret._id
    return ret
  }
})

export const UserModel = model('User', userSchema)
