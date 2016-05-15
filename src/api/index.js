
import { Router } from 'express'
import { json } from 'body-parser'
import { userData, postUser } from './users'
import { authenticate } from './authenticate'
import { issueToken, setUser } from './tokens'
import { knex, redis } from './core'
import { pollsData, getPoll, postPoll,
         postVote, deletePoll, getPollsByUsername } from './polls'
import errorHandler from './error-handler'


const users = userData(knex)
const polls = pollsData(knex)


export default new Router()
  .use(json())
  .post('/signup', postUser(users), issueToken(redis))
  .post('/authenticate', authenticate(users), issueToken(redis))
  .get('/:username/polls', getPollsByUsername(polls))
  .get('/:username/:slug', getPoll(polls))
  .post('/:username/:slug/:optionId', postVote(polls))
  .use(setUser(redis))
  .post('/polls', postPoll(polls))
  // USE ownsPoll
  .delete('/polls/:pollId', deletePoll(polls))
  // POST /polls/:pollId/options -> addOption
  // USE ownsOption
  // DELETE /options/:optionId -> deleteOption
  .use(errorHandler)
