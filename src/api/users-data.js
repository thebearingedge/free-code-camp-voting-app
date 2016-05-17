
import { hash } from 'bcrypt-as-promised'
import { snakeKeys, camelKeys } from './utils'


export const usersData = knex => ({

  async findByUsername(username) {

    const user = await knex
      .from('users')
      .where({ username })
      .first()

    return camelKeys(user || null)
  },


  async create(user) {

    const { username, password: unhashed } = user

    const password = await hash(unhashed, 10)

    const [ id ] = await knex
      .insert({ username, password })
      .into('users')
      .returning('id')

    return { id, username }
  },


  async isPollOwner(userId, pollId) {

    const { count } = await knex
      .count('*')
      .from('polls')
      .where(snakeKeys({ id: pollId, userId }))
      .first()

    return !!count
  }

})
