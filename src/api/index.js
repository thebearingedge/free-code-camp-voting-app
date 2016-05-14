
import { Router } from 'express'
import { json } from 'body-parser'
import { userData, postUser } from './users'
import { authenticate } from './authenticate'
import { issueToken, setUser } from './tokens'
import { knex, redis } from './core'
import { vote } from './vote'
import { pollsData, getPoll, postPoll } from './polls'
import errorHandler from './error-handler'


const users = userData(knex)
const polls = pollsData(knex)

export default new Router()
  .use(json())
  .post('/signup', postUser(users), issueToken(redis))
  .post('/authenticate', authenticate(users), issueToken(redis))
  .post('/vote/:optionId', vote(knex))
  .get('/:username/:slug', getPoll(polls))
  .use(setUser(redis))
  .post('/polls', postPoll(polls))
  // DELETE /polls/:slug -> deletePoll
  // GET /:username/polls -> listPolls
  .use(errorHandler)
