
import joi from 'joi'
import wrap from 'express-async-wrap'
import { snakeKeys, camelKeys, lowerSlug, validate } from './utils'
import { NotFound } from './errors'


export const optionSchema = joi.object().keys({
  value: joi.string().required()
})


export const pollSchema = joi.object().keys({
  question: joi.string().required(),
  options: joi.array().min(1).items(optionSchema).required()
})


export const pollsData = knex => ({

  async findByUserAndSlug(username, slug, trx) {

    const poll = await knex
      .transacting(trx)
      .select('p.id', 'u.username as user', 'p.question', 'p.slug')
      .from('polls as p')
      .innerJoin('users as u', 'p.user_id', 'u.id')
      .where('u.username', username)
      .andWhere('p.slug', slug)
      .first()

    if (!poll) return null

    const { id: pollId } = poll

    const options = await knex
      .transacting(trx)
      .from('options_view')
      .orderBy('id')
      .where(snakeKeys({ pollId }))

    return camelKeys({ ...poll, options })
  },

  async createForUser(user, data) {

    const { id: userId, username } = user
    const { question, options } = data
    const slug = lowerSlug(question)

    const poll = { userId, question, slug }

    return knex.transaction(async trx => {

      const [ pollId ] = await trx
        .insert(snakeKeys(poll))
        .into('polls')
        .returning('id')

      await trx
        .insert(snakeKeys(options.map(option => ({ pollId, ...option }))))
        .into('options')

      return this.findByUserAndSlug(username, slug, trx)
    })


  }
})


export const postPoll = polls => wrap(async (req, res, next) => {

  const { user, body } = req

  const poll = await validate(body, pollSchema)

  const created = await polls.createForUser(user, poll)

  res.status(201).json(created)
})


export const getPoll = polls => wrap(async ({ params }, res, next) => {

  const { username, slug } = params

  const poll = await polls.findByUserAndSlug(username, slug)

  if (!poll) {

    const message = `poll "${slug}" not found for user "${username}"`

    throw new NotFound(message)
  }

  res.json(poll)
})
