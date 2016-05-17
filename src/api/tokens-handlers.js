
import jwt from 'jsonwebtoken'
import wrap from 'express-async-wrap'
import { tokenSecret } from '../config'


export const createToken = async payload =>

  Promise.resolve(jwt.sign(payload, tokenSecret, {}))


export const issueToken = tokens => wrap(async ({ user }, res) => {

  const token = await createToken(user)

  await tokens.set(token)

  res.status(201).json({ ...user, token })
})
