
import jwt from 'jsonwebtoken'
import wrap from 'express-async-wrap'
import { Forbidden } from './errors'
import { tokenSecret, tokenExpiry } from '../config'


export const verifyToken = token => new Promise((resolve, reject) =>

  jwt.verify(token, tokenSecret, (err, payload) =>

    (!err && resolve(payload)) || reject(err)
  )
)


export const protect = tokens => wrap(async (req, res, next) => {

  const token = req.get('x-access-token')

  if (!token) throw new Forbidden('action requires authentication')

  const issued = await tokens.get(token)

  if (!issued) throw new Forbidden('invalid access token')

  try {

    res.locals.user = await verifyToken(token)
  }
  catch (err) {

    throw new Forbidden('invalid access token')
  }

  await tokens.set(token, tokenExpiry, token)

  next()
})
