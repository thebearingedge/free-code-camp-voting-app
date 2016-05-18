
import { hash } from 'bcrypt-as-promised'
import { snakeKeys, camelKeys } from './utils'


export const usersData = knex => ({

  async nameExists(username) {

    return knex
      .select(knex.raw('count(*)::int::bool as exists'))
      .from('users')
      .where({ username })
      .first()
      .then(({ exists }) => exists)
  },


  async findByUsername(username) {

    const user = await knex
      .select('id', 'username')
      .from('users')
      .where({ username })
      .first()

    if (!user) return null

    const polls = await knex
      .select('*')
      .from('polls_view')
      .where(snakeKeys({ userId: user.id }))

    return camelKeys({ ...user, polls })
  },


  async findHash(username) {

    const user = await knex
      .select('id', 'password as hash')
      .from('users')
      .where({ username })
      .first()

    return user || null
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

    return knex
      .select(knex.raw('count(*)::int::bool as exists'))
      .from('polls')
      .where(snakeKeys({ id: pollId, userId }))
      .first()
      .then(({ exists }) => exists)
  }

})
