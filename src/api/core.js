
import knex from 'knex'
import { database } from '../config'


const { NODE_ENV: env } = process.env
const sql = database[env || 'development']


export const db = knex(sql)
