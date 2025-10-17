import mongoose from 'mongoose'
import { DATABASE_CONFIG, buildMongoConnectionString } from '../config/index.mjs'
import * as logger from '../utils/logger.mjs'

let eventsBound = false

const bindConnectionEvents = () => {
  if (eventsBound) return

  mongoose.connection.on('connected', () => {
    logger.info(`MongoDB підключено (${mongoose.connection.name})`)
  })

  mongoose.connection.on('reconnected', () => {
    logger.info('MongoDB підключено повторно')
  })

  mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB підключення втрачено')
  })

  mongoose.connection.on('error', (error) => {
    logger.error('MongoDB помилка підключення:', error)
  })

  eventsBound = true
}

export const connectToDatabase = async ({
  uri,
  dbName,
  autoIndex = DATABASE_CONFIG.AUTO_INDEX,
  maxPoolSize = DATABASE_CONFIG.MAX_POOL_SIZE,
  isServerless = false
} = {}) => {
  bindConnectionEvents()

  const connectionString = buildMongoConnectionString(uri, dbName)

  // Якщо вже підключені або підключаємося
  if (mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2) {
    // Чекаємо поки підключення встановиться (для serverless)
    if (mongoose.connection.readyState === 2 && isServerless) {
      await new Promise((resolve) => {
        const checkConnection = setInterval(() => {
          if (mongoose.connection.readyState === 1) {
            clearInterval(checkConnection)
            resolve()
          }
        }, 100)
        //Timeout через 5 секунд
        setTimeout(() => {
          clearInterval(checkConnection)
          resolve()
        }, 5000)
      })
    }
    return { connection: mongoose.connection }
  }

  // Підключаємося якщо ще не підключені
  if (mongoose.connection.readyState === 0) {
    const connectOptions = {
      autoIndex,
      // Більший timeout для serverless
      serverSelectionTimeoutMS: isServerless ? 15000 : 10000,
      connectTimeoutMS: isServerless ? 15000 : 10000
    }

    if (typeof maxPoolSize === 'number') {
      // Менший pool для serverless
      connectOptions.maxPoolSize = isServerless ? Math.min(maxPoolSize, 5) : maxPoolSize
    }

    await mongoose.connect(connectionString, connectOptions)
  }

  return { connection: mongoose.connection }
}

export const disconnectFromDatabase = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close()
  }
}
