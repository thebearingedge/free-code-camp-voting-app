
import wrap from 'express-async-wrap'
import { snakeKeys, camelKeys } from './utils'


export const vote = knex => wrap(async ({ params }, res) => {

  const { optionId } = params

  await knex
    .insert(snakeKeys({ optionId }))
    .into('votes')

  const option = await knex
    .from('options_view')
    .where({ id: optionId })
    .first()

  res.json(camelKeys(option))
})
