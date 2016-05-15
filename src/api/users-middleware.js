
import joi from 'joi'
import wrap from 'express-async-wrap'
import { compare } from 'bcrypt-as-promised'
import { Forbidden } from './errors'
import { validate } from './utils'


export const newUserSchema = joi.object().keys({
  username: joi.string().token().required(),
  password: joi.string().required()
})


export const postUser = users => wrap(async (req, _, next) => {

  const user = await validate(req.body, newUserSchema)

  const { id, username } = await users.create(user)

  req.user = { id, username }

  next()
})


export const checkPollOwner = users => wrap(async ({ params, user }, _, next) => {

  const { id } = user
  const { pollId } = params

  const isOwner = await users.isPollOwner(id, pollId)

  if (!isOwner) throw new Forbidden('permission denied')

  next()
})


export const authenticate = users => wrap(async (req, res, next) => {

  const { body } = req

  await validate(body, newUserSchema)

  const { username, password } = body

  const user = await users.findByUsername(username)

  if (!user) throw new Forbidden('invalid login')

  const { id, password: hash } = user

  try {

    await compare(password, hash)

    req.user = { id, username }
  }
  catch (err) {

    const error = new Forbidden('invalid login')

    error.originalError = err

    throw error
  }

  next()
})