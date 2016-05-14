
import { Router } from 'express'
import { json } from 'body-parser'
import { userData, createUser } from './users'
import { authenticate } from './authenticate'
import { issueToken, setUser } from './tokens'
import { knex, redis } from './core'
import { vote } from './vote'
import { getPoll } from './polls'
import errorHandler from './error-handler'


const users = userData(knex)


export default new Router()
  .use(json())
  .post('/signup', createUser(users), issueToken(redis))
  .post('/authenticate', authenticate(knex), issueToken(redis))
  .post('/vote/:optionId', vote(knex))
  .get('/:username/:slug', getPoll(knex))
  .use(setUser(redis))
  // POST /polls -> createPoll
  // DELETE /polls/:slug -> deletePoll
  // GET /:username/polls -> listPolls
  .use(errorHandler)
