
import express from 'express'
import { json } from 'body-parser'
import { createUser } from './users'
import { authenticate } from './authenticate'
import { issueToken, setUser } from './tokens'
import { knex, redis } from './core'
import { vote } from './vote'
import { getPoll } from './polls'
import errorHandler from './error-handler'


const api = express()


api
  .use(json())
  .post('/signup', createUser(knex), issueToken(redis))
  .post('/authenticate', authenticate(knex), issueToken(redis))
  .post('/vote/:optionId', vote(knex))
  .get('/:username/:slug', getPoll(knex))
  .use(setUser(redis))
  // POST /polls -> createPoll
  // DELETE /polls/:slug -> deletePoll
  // GET /:username/polls -> listPolls
  .use(errorHandler)


api.listen(3000, _ => console.log('listening on 3000'))
