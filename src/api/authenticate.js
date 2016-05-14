
import wrap from 'express-async-wrap'
import { compare } from 'bcrypt-as-promised'
import { userSchema as credentialsSchema } from './users'
import { Unauthorized } from './errors'
import { validate } from './utils'


export const authenticate = users => wrap(async (req, res, next) => {

  const { body } = req

  await validate(body, credentialsSchema)

  const { username, password } = body

  const user = await users.findByUsername(username)

  if (!user) throw new Unauthorized('invalid login')

  const { id, password: hash } = user

  try {

    await compare(password, hash)

    req.user = { id, username }
  }
  catch (err) {

    const error = new Unauthorized('invalid login')

    error.originalError = err

    throw error
  }

  next()
})
