
import { Router } from 'express'
import { json } from 'body-parser'
import { knex, redis } from './core'
import { usersData } from './users-data'
import { tokensData } from './tokens-data'
import { pollsData } from './polls-data'
import { optionsData } from './options-data'
import { votesData } from './votes-data'

import { protect } from './tokens-middleware'
import { authenticate, postUser, checkPollOwner } from './users-middleware'

import { postVote } from './votes-handlers'
import { postOption } from './options-handlers'
import { getUserByName } from './users-handlers'
import { issueToken, deleteToken } from './tokens-handlers'
import { getPolls, getPoll,
         postPoll, deletePoll, getPollByUserSlug } from './polls-handlers'

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


const userRoutes = new Router()
  .get('/:username', getUserByName(users))
  .get('/:username/:slug', getPollByUserSlug(polls))


export default new Router()
  .use(json())
  .post('/vote', postVote(votes))
  .post('/signup', postUser(users))
  .use('/authenticate', authRoutes)
  .use('/polls', pollsRoutes)
  .use('/user', userRoutes)
  .use('*', notFoundHandler)
  .use(errorHandler)
