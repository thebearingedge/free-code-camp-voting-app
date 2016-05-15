
import jwt from 'jsonwebtoken'
import wrap from 'express-async-wrap'
import { Unauthorized } from './errors'
import { tokenSecret, tokenExpiry } from '../config'


export const verifyToken = token => new Promise((resolve, reject) =>

  jwt.verify(token, tokenSecret, (err, payload) => {

    if (err) return reject(err)
    resolve(payload)
  })
)


export const setUser = redis => wrap(async (req, _, next) => {

  const token = req.get('x-access-token')

  if (!token) throw new Unauthorized('access token required')

  const issued = await redis.getAsync(token)

  if (!issued) throw new Unauthorized('invalid token')

  try {

    req.user = await verifyToken(token)
  }
  catch (err) {

    const error = new Unauthorized('invalid token')

    error.originalError = err

    throw error
  }

  await redis.setexAsync(token, tokenExpiry, token)

  next()
})