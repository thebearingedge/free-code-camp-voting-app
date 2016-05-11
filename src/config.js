
import { join } from 'path'


const client = 'postgresql'
const migrations = { directory: join(__dirname, '/migrations') }


export const database = {
  development: {
    client,
    migrations,
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
