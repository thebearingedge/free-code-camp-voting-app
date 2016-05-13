
import wrap from 'express-async-wrap'
import joi from 'joi'
import { hash } from 'bcrypt-as-promised'


export const credentialsSchema = joi.object().keys({
  id: joi.number(),
  username: joi.string().token().required(),
  password: joi.string().required()
})


export const createUser = knex => wrap(async (req, _, next) => {

  const { body } = req
  const { error, value } = joi.validate(body, credentialsSchema)

  if (error) throw error

  const { username, password: unhashed } = value

  const password = await hash(unhashed, 10)

  const [ id ] = await knex
    .insert({ username, password }, 'id')
    .into('users')

  req.user = { id, username }

  next()
})
