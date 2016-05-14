
import wrap from 'express-async-wrap'
import joi from 'joi'
import { hash } from 'bcrypt-as-promised'
import { validate } from './utils'


export const newUserSchema = joi.object().keys({
  username: joi.string().token().required(),
  password: joi.string().required()
})


export const createUser = users => wrap(async (req, _, next) => {

  const user = await users.create(req.body)

  req.user = user

  next()
})


export const userData = knex => ({

  async create(data) {

    const { username, password: unhashed } = await validate(data, newUserSchema)

    const password = await hash(unhashed, 10)

    const [ id ] = await knex
      .insert({ username, password }, 'id')
      .into('users')

    return { id, username }
  },

  async findByUsername(username) {

    return knex
      .table('users')
      .where({ username })
      .first()
  }

})
