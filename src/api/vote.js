
import wrap from 'express-async-wrap'
import { snakeKeys, camelKeys } from './utils'


export const vote = knex => wrap(async ({ params }, res) => {

  const { optionId } = params

  const option = await knex
    .table('options')
    .where(snakeKeys({ optionId }))

  if (!option) throw new Error('invalid poll option')

  const { pollId } = camelKeys(option)

  await knex
    .insert(snakeKeys({ pollId }))
    .into('votes')

  const poll = await knex
    .from('polls_view')
    .where(snakeKeys({ pollId }))

  const options = await knex
    .from('options')
    .where(snakeKeys({ pollId }))

  res.json(camelKeys({ ...poll, options }))
})
