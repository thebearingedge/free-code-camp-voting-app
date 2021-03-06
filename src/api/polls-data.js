
import { snakeKeys, camelKeys } from './utils'


export const pollsData = knex => ({

  async list() {

    const results = await knex
      .select('*')
      .from('polls_view')

    return camelKeys(results)
  },


  async findById(id, trx) {

    const poll = await knex
      .select('*')
      .from('polls_view')
      .where({ id })
      .first()
      .transacting(trx)

    if (!poll) return null

    const { id: pollId } = poll

    const options = await knex
      .select('*')
      .from('options_view')
      .where(snakeKeys({ pollId }))
      .transacting(trx)

    return camelKeys({ ...poll, options })
  },


  async create(data) {

    const { userId, question, slug, options } = data
    const poll = { userId, question, slug }

    return knex.transaction(async trx => {

      const [ pollId ] = await trx
        .insert(snakeKeys(poll))
        .into('polls')
        .returning('id')

      await trx
        .insert(snakeKeys(options.map(opt => ({ pollId, ...opt }))))
        .into('options')

      return this.findById(pollId, trx)
    })
  },


  async deleteById(id) {

    return knex
      .delete()
      .from('polls')
      .where({ id })
  },


  async findByUserSlug(username, slug) {

    const found = await knex
      .select('p.id')
      .from('users as u')
      .innerJoin('polls as p', 'u.id', 'p.user_id')
      .where({ username, slug })
      .first()

    if (!found) return null

    return this.findById(found.id)
  },


  async pollExists(userId, slug) {

    const { exists } = await knex
      .select(knex.raw('count(*)::int::bool as exists'))
      .from('polls')
      .where(snakeKeys({ userId, slug }))
      .first()

    return exists
  }

})
