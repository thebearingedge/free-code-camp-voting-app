
import { snakeKeys, camelKeys } from './utils'


export const votesData = knex => ({

  async findById(id) {

    const vote = await knex
      .select('id', 'option_id', knex.raw('date::text'))
      .from('votes')
      .where({ id })
      .first()

    return camelKeys(vote)
  },


  async create(vote) {

    const [ id ] = await knex
      .insert(snakeKeys(vote))
      .into('votes')
      .returning('id')

    return this.findById(id)
  },


  async optionExists(id) {

    const { exists } = await knex
      .select(knex.raw('count(*)::int::bool as exists'))
      .from('options')
      .where({ id })
      .first()

    return exists
  }

})
