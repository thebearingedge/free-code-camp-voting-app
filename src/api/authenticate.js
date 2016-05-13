
import joi from 'joi'
import wrap from 'express-async-wrap'
import { compare } from 'bcrypt-as-promised'
import { credentialsSchema } from './users'


export const authenticate = knex => wrap(async (req, res, next) => {

  const { body } = req
  const { error } = joi.validate(body, credentialsSchema)

  if (error) throw new Error('invalid login')

  const { username, password } = body

  const user = await knex
    .table('users')
    .where({ username })
    .first()

  const { id, password: hash } = user

  try {

    await compare(password, hash)

    req.user = { id, username }
  }
  catch (err) {

    const error = new Error('invalid login')

    error.originalError = err

    throw error
  }

  next()
})
