
import jwt from 'jsonwebtoken'
import wrap from 'express-async-wrap'
import { Forbidden } from './errors'
import { tokenSecret, tokenExpiry } from '../config'


export const verifyToken = token => new Promise((resolve, reject) =>

  jwt.verify(token, tokenSecret, (err, payload) => {

    if (err) return reject(err)

    resolve(payload)
  })
)


export const ensureToken = tokens => wrap(async (req, _, next) => {

  const token = req.get('x-access-token')

  if (!token) throw new Forbidden('access token required')

  const issued = await tokens.get(token)

  if (!issued) throw new Forbidden('invalid access token')

  try {

    req.user = await verifyToken(token)
  }
  catch (err) {

    throw new Forbidden('invalid access token')
  }

  await tokens.set(token, tokenExpiry, token)

  next()
})
