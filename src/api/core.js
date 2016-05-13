
import Knex from 'knex'
import Redis from 'redis'
import { promisifyAll } from 'bluebird'
import { pgConnection, redisConnection } from '../config'


promisifyAll(Redis.RedisClient.prototype)


export const redis = Redis.createClient(redisConnection)


export const knex = new Knex(pgConnection)
