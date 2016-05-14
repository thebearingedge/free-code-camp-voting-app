
import wrap from 'express-async-wrap'
import { compare } from 'bcrypt-as-promised'
import { newUserSchema as credentialsSchema } from './users'
import { UnauthorizedError } from './errors'
import { validate } from './utils'


export const authenticate = users => wrap(async (req, res, next) => {

  const { body } = req

  await validate(body, credentialsSchema)

  const { username, password } = body

  const user = await users.findByUsername(username)

  if (!user) throw new UnauthorizedError('invalid login')

  const { id, password: hash } = user

  try {

    await compare(password, hash)

    req.user = { id, username }
  }
  catch (err) {

    const error = new UnauthorizedError('invalid login')

    error.originalError = err

    throw error
  }

  next()
})
