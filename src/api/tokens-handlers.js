
import jwt from 'jsonwebtoken'
import wrap from 'express-async-wrap'
import { tokenSecret, tokenExpiry } from '../config'


export const createToken = async payload =>

  Promise.resolve(jwt.sign(payload, tokenSecret, {}))


export const issueToken = redis => wrap(async ({ user }, res) => {

  const token = await createToken(user)

  await redis.setexAsync(token, tokenExpiry, token)

  res.status(201).json({ ...user, token })
})
