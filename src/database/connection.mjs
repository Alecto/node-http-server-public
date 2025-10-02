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

export const connectToDatabase = async ({ uri, dbName, seed = DATABASE_CONFIG.SEED } = {}) => {
  bindConnectionEvents()

  const connectionString = buildMongoConnectionString(uri, dbName)

  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(connectionString, {
      autoIndex: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000
    })
  }

  return { connection: mongoose.connection, seed }
}

export const disconnectFromDatabase = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close()
  }
}
