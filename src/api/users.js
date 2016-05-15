
import wrap from 'express-async-wrap'
import joi from 'joi'
import { hash } from 'bcrypt-as-promised'
import { camelKeys, snakeKeys, validate } from './utils'
import { Unauthorized } from './errors'


export const userSchema = joi.object().keys({
  username: joi.string().token().required(),
  password: joi.string().required()
})


export const postUser = users => wrap(async (req, _, next) => {

  const user = await users.create(req.body)

  req.user = user

  next()
})


export const userData = knex => ({

  async create(data) {

    const { username, password: unhashed } = await validate(data, userSchema)

    const password = await hash(unhashed, 10)

    const [ id ] = await knex
      .insert({ username, password }, 'id')
      .into('users')

    return { id, username }
  },

  async findByUsername(username) {

    const user = await knex
      .from('users')
      .where({ username })
      .first()

    return camelKeys(user)
  },

  async isPollOwner(id, pollId) {

    const { count } = await knex
      .count('*')
      .from('polls')
      .where(snakeKeys({ id: pollId, userId: id }))
      .first()

    return !!count
  },

  async getPolls(user) {

    const polls = await knex
      .from('polls_view')
      .where({ user })

    return camelKeys(polls)
  }

})


export const checkPollOwner = users => wrap(async ({ params, user }, _, next) => {

  const { id } = user
  const { pollId } = params

  const isOwner = await users.isPollOwner(id, pollId)

  if (!isOwner) throw new Unauthorized('permission denied')

  next()
})


export const getPollsByUsername = users => wrap(async ({ params }, res) => {

  const { username } = params

  const polls = await users.getPolls(username)

  res.json(polls)
})
