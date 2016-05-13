
import express from 'express'
import { json } from 'body-parser'
import { createUser } from './users'
import { authenticate } from './authenticate'
import { issueToken, setUser } from './tokens'
import { knex, redis } from './core'
import errorHandler from './error-handler'


const api = express()


api
  .use(json())
  .post('/signup', createUser(knex), issueToken(redis))
  .post('/authenticate', authenticate(knex), issueToken(redis))
  .get('/', setUser(redis), (req, res) => res.json(req.user))
  .use(errorHandler)

api.listen(3000, _ => console.log('listening on 3000'))
