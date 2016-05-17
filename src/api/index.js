
import { Router } from 'express'
import { json } from 'body-parser'
import { knex, redis } from './core'
import { usersData } from './users-data'
import { tokensData } from './tokens-data'
import { pollsData } from './polls-data'
import { optionsData } from './options-data'
import { votesData } from './votes-data'
import { login, postUser, checkPollOwner } from './users-middleware'
import { protect } from './tokens-middleware'
import { issueToken } from './tokens-handlers'
import { postVote } from './votes-handlers'
import { postOption } from './options-handlers'
import { getPoll, postPoll, deletePoll } from './polls-handlers'
import { errorHandler } from './errors'


const users = usersData(knex)
const polls = pollsData(knex)
const votes = votesData(knex)
const options = optionsData(knex)
const tokens = tokensData(redis)


const pollsRoutes = new Router()
  .get('/:pollId', getPoll(polls))
  .use(protect(tokens))
  .post('/', postPoll(polls))
  .delete('/:pollId', checkPollOwner(users), deletePoll(polls))
  .post('/:pollId/options', checkPollOwner(users), postOption(options))


export default new Router()
  .use(json())
  .post('/signup', postUser(users), issueToken(tokens))
  .post('/login', login(users), issueToken(tokens))
  // DELETE '/login' -> logout
  .post('/vote', postVote(votes))
  .use('/polls', pollsRoutes)
  .use(errorHandler)
