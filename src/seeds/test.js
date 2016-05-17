
import { hash } from 'bcrypt-as-promised'
import { snakeKeys, lowerSlug } from '../api/utils'

const username = 'foo'
const unhashed = 'bar'

const question = 'What is your favorite color?'
const slug = lowerSlug(question)
const options = [
  { value: 'red' },
  { value: 'blue' },
  { value: 'green' }
]


export const seed = async knex => {

  await knex.raw('truncate table "users" restart identity cascade')

  const password = await hash(unhashed)

  const [ userId ] = await knex
    .insert({ username, password })
    .into('users')
    .returning('id')

  const [ pollId ] = await knex
    .insert(snakeKeys({ userId, question, slug }))
    .into('polls')
    .returning('id')

  await knex
    .insert(options.map(option => snakeKeys({ ...option, pollId })))
    .into('options')
}
