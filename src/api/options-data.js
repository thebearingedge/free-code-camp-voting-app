
import { camelKeys, snakeKeys } from './utils'


export const optionsData = knex => ({

  async findById(id) {

    const option = await knex
      .select('*')
      .from('options_view')
      .where({ id })
      .first()

    return camelKeys(option || null)
  },


  async create(data) {

    const [ id ] = await knex
      .insert(snakeKeys(data))
      .into('options')
      .returning('id')

    return this.findById(id)
  },


  async valueExists(pollId, value) {

    const { exists } = await knex
      .select(knex.raw('count(*)::int::bool as exists'))
      .from('polls as p')
      .innerJoin('options as o', 'p.id', 'o.poll_id')
      .where('p.id', pollId)
      .andWhere('o.value', value)
      .first()

    return exists
  },


  async optionExists(id) {

    const { exists } = await knex
      .select(knex.raw('count(*)::int::bool as exists'))
      .from('options')
      .where({ id })
      .first()

    return exists
  },


  async addVote(newVote) {

    const [ id ] = await knex
      .insert(snakeKeys(newVote))
      .into('votes')
      .returning('id')

    const vote = await knex
      .select('v.id', 'v.option_id', 'o.poll_id', knex.raw('v.date::text'))
      .from('votes as v')
      .innerJoin('options as o', 'v.option_id', 'o.id')
      .where('v.id', id)
      .first()

    return camelKeys(vote)
  }

})
