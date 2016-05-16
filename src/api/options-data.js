
import { camelKeys, snakeKeys } from './utils'


export const optionsData = knex => ({

  async findById(id) {

    const option = await knex
      .select('*')
      .from('options_view')
      .where({ id })
      .first()

    if (!option) return null

    return camelKeys(option)
  },

  async create(data) {

    const [ id ] = await knex
      .insert(snakeKeys(data))
      .into('options')
      .returning('id')

    return this.findById(id)
  }

})
