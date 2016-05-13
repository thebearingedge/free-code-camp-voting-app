
import jwt from 'jsonwebtoken'
import wrap from 'express-async-wrap'
import { tokenSecret, tokenExpiry } from '../config'


export const createToken = payload => new Promise((resolve, reject) =>

  jwt.sign(payload, tokenSecret, (err, token) =>

    (err && reject(err)) || resolve(token)
  )
)


export const verifyToken = token => new Promise((resolve, reject) =>

  jwt.verify(token, tokenSecret, (err, payload) =>

    (err && reject(err)) || resolve(payload)
  )
)


export const issueToken = redis => wrap(async ({ user }, res) => {

  const token = await createToken(user)

  await redis.setexAsync(token, tokenExpiry, token)

  res.json({ ...user, token })
})


export const setUser = redis => wrap(async (req, _, next) => {

  const token = req.headers['x-access-token']

  const issued = await redis.getAsync(token)

  if (!issued) throw new Error('invalid token')

  try {

    req.user = await verifyToken(token)

    await redis.setexAsync(token, tokenExpiry, token)
  }
  catch (err) {

    const error = new Error('invalid token')

    error.originalError = err

    throw error
  }

  next()
})

