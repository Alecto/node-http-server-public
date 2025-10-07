import { Schema, model } from 'mongoose'

const userSchema = new Schema(
  {
    auth0Id: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
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

// Примітка: Індекси вже визначені в полях схеми через unique: true
// Не потрібно додавати дублюючі індекси через schema.index()

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
