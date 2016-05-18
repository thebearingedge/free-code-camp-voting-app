
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
  .use('/:pollId', checkPollOwner(users))
  .delete('/:pollId', deletePoll(polls))
  .post('/:pollId/options', postOption(options))


const authRoutes = new Router()
  .post('/', authenticate(users), issueToken(tokens))
  .delete('/', deleteToken(tokens))


export default new Router()
  .use(json())
  // GET /profile/:username -> user profile & polls
  // GET /profile/:username/:slug -> profile & options
  .post('/vote', postVote(votes))
  .post('/signup', postUser(users))
  .use('/authenticate', authRoutes)
  .use('/polls', pollsRoutes)
  .use('*', notFoundHandler)
  .use(errorHandler)
