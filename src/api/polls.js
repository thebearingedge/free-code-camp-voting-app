
import joi from 'joi'
import wrap from 'express-async-wrap'
import { snakeKeys, camelKeys } from './utils'


export const optionSchema = joi.object().keys({

})


export const pollSchema = joi.object().keys({
  question: joi.string().required(),
  options: joi.array().required().items()
})


export const createPoll = knex => wrap(async (req, res, next) => {


})


export const getPoll = knex => wrap(async ({ params }, res, next) => {

  const { username, slug } = params

  const poll = await knex
    .select('p.id', 'u.username as user', 'p.question')
    .from('polls as p')
    .innerJoin('users as u', 'p.user_id', 'u.id')
    .where('u.username', username)
    .andWhere('p.slug', slug)
    .first()

  if (!poll) throw new Error(`poll "${slug}" not found for user "${username}"`)

  const { id: pollId } = poll

  const options = await knex
    .from('options_view')
    .where(snakeKeys({ pollId }))

  res.json(camelKeys({ ...poll, options }))
})
