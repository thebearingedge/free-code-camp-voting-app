
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


  async create({ optionId }) {

    const [ id ] = await knex
      .insert(snakeKeys({ optionId }))
      .into('votes')
      .returning('id')

    return this.findById(id)
  },


  async optionExists(id) {

    const { count } = await knex
      .count('*')
      .from('options')
      .where({ id })
      .first()

    return !!count
  }

})
