
import joi from 'joi'
import wrap from 'express-async-wrap'
import { snakeKeys, camelKeys, lowerSlug, validate } from './utils'
import { NotFound, Unauthorized } from './errors'


export const optionSchema = joi.object().keys({
  value: joi.string().required()
})


export const pollSchema = joi.object().keys({
  question: joi.string().required(),
  options: joi.array().min(1).items(optionSchema).required()
})


export const pollsData = knex => ({

  async findByUserAndSlug(user, slug, trx) {

    const poll = await knex
      .transacting(trx)
      .from('polls_view')
      .where({ user, slug })
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

  },

  async vote(optionId) {

    await knex
      .insert(snakeKeys({ optionId }))
      .into('votes')

    return this.findOptionById(optionId)
  },

  async findOptionById(id) {

    const option = await knex
      .from('options_view')
      .where(snakeKeys({ id }))
      .first()

    return camelKeys(option)
  },

  async deleteById(id) {

    return knex
      .delete()
      .from('polls')
      .where({ id })
  },

  async findById(id) {

    const poll = await knex
      .from('polls')
      .where({ id })
      .first()

    return camelKeys(poll)
  },

  async addOption(pollId, option) {

    const [ id ] = await knex
      .insert(snakeKeys({ pollId, ...option }))
      .into('options')
      .returning('id')

    return this.findOptionById(id)
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

    throw new NotFound(`poll '${slug}' not found for user '${username}'`)
  }

  res.json(poll)
})


export const postVote = polls => wrap(async ({ params }, res) => {

  const { username, slug, optionId } = params

  const poll = await polls.findByUserAndSlug(username, slug)

  if (!poll) {

    throw new NotFound(`poll '${slug}' not found for user '${username}'`)
  }

  const validOption = await polls.findOptionById(optionId)

  if (!validOption) {

    throw new NotFound(`invalid option for poll '${slug}'`)
  }

  const option = await polls.vote(optionId)

  res.status(201).json(option)
})


export const deletePoll = polls => wrap(async ({ params, user }, res) => {

  const { pollId } = params
  const { id: userId } = user

  const poll = await polls.findById(pollId)

  if (!poll) return res.sendStatus(204)

  const { userId: ownerId } = poll

  if (userId !== ownerId) {

    throw new Unauthorized('permission denied')
  }

  await polls.deleteById(pollId)

  res.sendStatus(204)
})


export const postOption = polls => wrap(async ({ params, body }, res) => {

  const { pollId } = params

  const option = await validate(body, optionSchema)

  const created = await polls.addOption(pollId, option)

  res.status(201).json(created)
})
