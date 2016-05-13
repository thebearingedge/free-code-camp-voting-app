
import express from 'express'
import { json } from 'body-parser'
import { createUser } from './users'
import { authenticate } from './authenticate'
import { issueToken, setUser } from './tokens'
import { knex, redis } from './core'
import errorHandler from './error-handler'
import { vote } from './vote'
import { getPoll } from './polls'


const api = express()


api
  .use(json())
  .post('/signup', createUser(knex), issueToken(redis))
  .post('/authenticate', authenticate(knex), issueToken(redis))
  .post('/:optionId', vote(knex))
  .get('/:username/:slug', getPoll(knex))
  .get('/', setUser(redis), (req, res) => res.json(req.user))
  .use(errorHandler)

api.listen(3000, _ => console.log('listening on 3000'))
