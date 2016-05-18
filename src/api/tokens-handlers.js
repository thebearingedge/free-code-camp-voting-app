
import jwt from 'jsonwebtoken'
import wrap from 'express-async-wrap'
import { tokenSecret } from '../config'


export const createToken = async payload =>

  Promise.resolve(jwt.sign(payload, tokenSecret, {}))


export const issueToken = tokens => wrap(async (_, res) => {

  const { user } = res.locals

  const token = await createToken(user)

  await tokens.set(token)

  res.status(201).json({ ...user, token })
})


export const deleteToken = tokens => wrap(async (req, res) => {

  const token = req.get('x-access-token')

  await tokens.unset(token)

  res.sendStatus(204)
})
