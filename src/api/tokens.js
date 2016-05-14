
import jwt from 'jsonwebtoken'
import wrap from 'express-async-wrap'
import { Unauthorized } from './errors'
import { tokenSecret, tokenExpiry } from '../config'


export const createToken = async payload =>

  Promise.resolve(jwt.sign(payload, tokenSecret, {}))


export const verifyToken = token => new Promise((resolve, reject) =>

  jwt.verify(token, tokenSecret, (err, payload) => {

    if (err) return reject(err)
    resolve(payload)
  })
)


export const issueToken = redis => wrap(async ({ user }, res) => {

  const token = await createToken(user)

  await redis.setexAsync(token, tokenExpiry, token)

  res.status(201).json({ ...user, token })
})


export const setUser = redis => wrap(async (req, _, next) => {

  const token = req.headers['x-access-token']

  if (!token) throw new Unauthorized('x-access-token required')

  const issued = await redis.getAsync(token)

  if (!issued) throw new Unauthorized('invalid token')

  try {

    req.user = await verifyToken(token)

    await redis.setexAsync(token, tokenExpiry, token)
  }
  catch (err) {

    const error = new Unauthorized('invalid token')

    error.originalError = err

    throw error
  }

  next()
})

