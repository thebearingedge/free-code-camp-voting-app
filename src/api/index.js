
import { Router } from 'express'
import { json } from 'body-parser'
import { knex, redis } from './core'
import errorHandler from './error-handler'
import { authenticate } from './authenticate'
import { issueToken, setUser } from './tokens'
import { userData, postUser,
         checkPollOwner, getPollsByUsername } from './users'
import { pollsData, getPoll, postPoll,
         postOption, postVote, deletePoll } from './polls'


const users = userData(knex)
const polls = pollsData(knex)

// TODO: reorganize routes into something more RESTful
// TODO: fix app.js file watching
// TODO: finish custom errors (InternalServerError, ValidationFailure)
// TODO: stub real Data Access objects in route tests

export default new Router()
  .use(json())
  .post('/signup', postUser(users), issueToken(redis))
  .post('/authenticate', authenticate(users), issueToken(redis))
  .get('/:username/polls', getPollsByUsername(users))
  .get('/:username/:slug', getPoll(polls))
  .post('/:username/:slug/:optionId', postVote(polls))
  .use(setUser(redis))
  .post('/polls', postPoll(polls))
  .delete('/polls/:pollId', checkPollOwner(users), deletePoll(polls))
  .post('/polls/:pollId/options', checkPollOwner(users), postOption(polls))
  .use(errorHandler)
