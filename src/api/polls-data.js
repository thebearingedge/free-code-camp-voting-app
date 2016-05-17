
import { snakeKeys, camelKeys, lowerSlug } from './utils'


export const pollsData = knex => ({

  async findById(id) {

    const poll = await knex
      .select('*')
      .from('polls_view')
      .where({ id })
      .first()

    if (!poll) return null

    const { id: pollId } = poll

    const options = await knex
      .select('*')
      .from('options_view')
      .where(snakeKeys({ pollId }))

    return camelKeys({ ...poll, options })
  },

  async create(data) {

    const { userId, question, options } = data
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

      return this.findById(pollId)
    })
  },

  async deleteById(id) {

    return knex
      .delete()
      .from('polls')
      .where({ id })
  }

})
