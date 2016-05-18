
import { Router } from 'express'
import { json } from 'body-parser'
import { knex, redis } from './core'
import { usersData } from './users-data'
import { tokensData } from './tokens-data'
import { pollsData } from './polls-data'
import { optionsData } from './options-data'
import { votesData } from './votes-data'
import { authenticate, postUser, checkPollOwner } from './users-middleware'
import { protect } from './tokens-middleware'
import { issueToken, deleteToken } from './tokens-handlers'
import { postVote } from './votes-handlers'
import { postOption } from './options-handlers'
import { getPolls, getPoll, postPoll, deletePoll } from './polls-handlers'
import { errorHandler, notFoundHandler } from './errors'


const users = usersData(knex)
const polls = pollsData(knex)
const votes = votesData(knex)
const options = optionsData(knex)
const tokens = tokensData(redis)


const pollsRoutes = new Router()
  .get('/', getPolls(polls))
  .get('/:pollId', getPoll(polls))
  .use(protect(tokens))
  .post('/', postPoll(polls))
  .delete('/:pollId', checkPollOwner(users), deletePoll(polls))
  .post('/:pollId/options', checkPollOwner(users), postOption(options))


export default new Router()
  .use(json())
  .post('/signup', postUser(users))
  .post('/authenticate', authenticate(users), issueToken(tokens))
  .delete('/authenticate', deleteToken(tokens))
  .post('/vote', postVote(votes))
  .use('/polls', pollsRoutes)
  .use('*', notFoundHandler)
  .use(errorHandler)
