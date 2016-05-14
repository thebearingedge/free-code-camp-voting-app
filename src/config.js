
import { join } from 'path'


const client = 'postgresql'
const migrations = { directory: join(__dirname, '/migrations') }
const seeds = { directory: join(__dirname, '/seeds') }


export const database = {
  development: {
    client,
    migrations,
    seeds,
    connection: {
      user: 'voting-app',
      password: 'voting-app',
      database: 'voting-app'
    }
  },
  production: {
    client,
    migrations,
    connection: process.env.DATABASE_URL,
    ssl: true
  }
}


export const port = process.env.PORT || 3000


export const pgConnection = database[process.env.NODE_ENV || 'development']


export const tokenSecret = process.env.TOKEN_SECRET || 'secret'


export const tokenExpiry = process.env.TOKEN_EXPIRY || 14400


export const redisConnection = process.env.REDIS_URL
