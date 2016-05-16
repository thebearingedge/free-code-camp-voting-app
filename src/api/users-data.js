
import joi from 'joi'
import { hash } from 'bcrypt-as-promised'
import { validate, snakeKeys, camelKeys } from './utils'


export const userSchema = joi.object().keys({
  username: joi.string().token().required(),
  password: joi.string().required()
})


export const usersData = knex => ({

  async findByUsername(username) {

    const user = await knex
      .from('users')
      .where({ username })
      .first()

    if (!user) return null

    return camelKeys(user)
  },

  async create(data) {

    const { username, password: unhashed } = await validate(data, userSchema)

    const password = await hash(unhashed, 10)

    const [ id ] = await knex
      .insert({ username, password }, 'id')
      .into('users')

    return { id, username }
  },

  async isPollOwner(userId, pollId) {

    const { count } = await knex
      .count('*')
      .from('polls')
      .where(snakeKeys({ id: pollId, userId }))
      .first()

    return !!count
  }

})
