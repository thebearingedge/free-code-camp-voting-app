
import jwt from 'jsonwebtoken'
import wrap from 'express-async-wrap'
import { UnauthorizedError } from './errors'
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

  res.json({ ...user, token })
})


export const setUser = redis => wrap(async (req, _, next) => {

  const token = req.headers['x-access-token']

  if (!token) throw new UnauthorizedError('x-access-token required')

  const issued = await redis.getAsync(token)

  if (!issued) throw new UnauthorizedError('invalid token')

  try {

    req.user = await verifyToken(token)

    await redis.setexAsync(token, tokenExpiry, token)
  }
  catch (err) {

    const error = new UnauthorizedError('invalid token')

    error.originalError = err

    throw error
  }

  next()
})

