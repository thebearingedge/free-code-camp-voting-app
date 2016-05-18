
import { tracery } from '@thebearingedge/test-utils'
import { knex, redis } from '../core'

after(() => {
  redis.quit()
  knex.destroy()
})

export const PollListItem = {
  id: Number,
  username: String,
  question: String,
  slug: String,
  userId: Number,
  votes: Number
}

export const Profile = {
  id: Number,
  username: String,
  polls: [tracery(PollListItem)]
}

export const Poll = {
  id: Number,
  username: String,
  question: String,
  slug: String,
  userId: Number,
  votes: Number,
  options: [tracery(Option)]
}

export const Auth = {
  id: Number,
  username: String,
  token: String
}

export const Vote = {
  id: Number,
  optionId: Number,
  date: String
}

export const Option = {
  id: Number,
  value: String,
  pollId: Number,
  votes: Number
}
