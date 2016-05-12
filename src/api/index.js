
import express from 'express'
import { json } from 'body-parser'
import { signup } from './users'
import { db } from './core'

const api = express()

api.use(json())

api.post('/signup', signup(db))


api.listen(3000, _ => console.log('listening on 3000'))
