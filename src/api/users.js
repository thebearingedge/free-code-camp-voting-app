
import wrap from 'express-async-wrap'
import promisify from 'es6-promisify'
import joi from 'joi'
import { hash } from 'bcrypt-as-promised'


export const userSchema = joi.object().keys({
  username: joi.string().token().required(),
  password: joi.string().required()
})


export const validateUser = promisify(userSchema.validate.bind(userSchema))


export const userValidation = wrap(async ({ body }, res, next) => {


})


export const createUser = knex => wrap(async ({ body }, res, next) => {

  const { username, password: unhashed } = await validateUser(body)

  const password = await hash(unhashed, 10)

  const id = await knex
    .insert({ username, password }, 'id')
    .into('users')

})
