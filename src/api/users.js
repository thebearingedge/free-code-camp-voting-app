
import wrap from 'express-async-wrap'
import joi from 'joi'
import { hash } from 'bcrypt-as-promised'
import jwt from 'jsonwebtoken'
import { tokenSecret } from '../config'


export const userSchema = joi.object().keys({
  username: joi.string().token().required(),
  password: joi.string().required()
})


export const sign = payload =>

  new Promise((resolve, reject) =>

    jwt.sign(payload, tokenSecret, {}, (err, token) =>
      (err && reject(err)) || resolve(token)
    )
  )


export const signup = knex => wrap(async ({ body }, res, next) => {

  const { error, value } = joi.validate(body, userSchema)

  if (error) return next(error)

  const { username, password: unhashed } = value

  const password = await hash(unhashed, 10)

  const id = await knex
    .insert({ username, password }, 'id')
    .into('users')

  const token = await sign({ id, username }, tokenSecret)

  res.json({ token })
})
