
import joi from 'joi'
import wrap from 'express-async-wrap'
import { compare } from 'bcrypt-as-promised'
import { Forbidden, BadRequest } from './errors'
import { validate } from './utils'


export const userSchema = joi.object().keys({
  username: joi.string().token().required(),
  password: joi.string().required()
})


export const postUser = users => wrap(async (req, res, next) => {

  const user = await validate(req.body, userSchema)

  const exists = await users.nameExists(user.username)

  if (exists) throw new BadRequest('username is not available')

  res.locals.user = await users.create(user)

  res.redirect(307, '/api/authenticate')
})


export const checkPollOwner = users => wrap(async ({ params }, { locals }, next) => {

  const { id: userId } = locals.user
  const { pollId } = params

  const isOwner = await users.isPollOwner(userId, pollId)

  if (!isOwner) throw new Forbidden('permission denied')

  next()
})


export const authenticate = users => wrap(async (req, res, next) => {

  const { body } = req

  const { username, password } = await validate(body, userSchema)

  const user = await users.findHash(username)

  if (!user) throw new Forbidden('invalid login')

  const { id, hash } = user

  try {

    await compare(password, hash)
  }
  catch (err) {

    throw new Forbidden('invalid login')
  }

  res.locals.user = { id, username }

  next()
})
