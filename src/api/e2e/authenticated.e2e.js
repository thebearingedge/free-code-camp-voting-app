
import { expect, request } from '@thebearingedge/test-utils'
import express from 'express'
import jwt from 'jsonwebtoken'
import { tokenSecret } from '../../config'
import { knex, redis } from '../core'
import api from '../'

describe('an authenticated user', () => {

  let client, token

  before(async () => {

    await knex.seed.run()

    const app = express()
      .use('/api', api)

    const user = await knex
      .select('id', 'username')
      .from('users')
      .first()

    token = jwt.sign(user, tokenSecret)

    client = request(app)

    await redis.setAsync(token, token)
  })

  it('can see all polls', async () => {

    const { body: polls } = await client
      .get('/api/polls')
      .set('x-access-token', token)
      .expect(200)

    expect(polls[0]).to.have.interface({
      id: Number,
      username: String,
      question: String,
      slug: String,
      userId: Number,
      votes: Number
    })
  })

  it('can see any poll details', async () => {

    const { body: poll } = await client
      .get('/api/polls/1')
      .set('x-access-token', token)
      .expect(200)

    expect(poll).to.have.interface({
      id: Number,
      username: String,
      question: String,
      slug: String,
      userId: Number,
      votes: Number,
      options: Array
    })

    const [ option ] = poll.options

    expect(option).to.have.interface({
      id: Number,
      value: String,
      pollId: Number,
      votes: Number
    })
  })

  it('can vote on all polls', async () => {

    const { body: vote } = await client
      .post('/api/vote')
      .set('x-access-token', token)
      .send({ optionId: 1 })
      .expect(201)

    expect(vote).to.have.interface({
      id: Number,
      optionId: Number,
      date: String
    })
  })

  it('can add an option to their own poll', async () => {

    const { body: option } = await client
      .post('/api/polls/1/options')
      .set('x-access-token', token)
      .send({ value: 'yellow' })
      .expect(201)

    expect(option).to.have.interface({
      id: Number,
      pollId: Number,
      value: String,
      votes: Number
    })
  })

  it('can create a new poll', async () => {

    const newPoll = {
      question: 'What is your favorite dog?',
      options: [{ value: 'Basenji' }, { value: 'Pom-Chi' } ]
    }

    const { body: poll } = await client
      .post('/api/polls')
      .set('x-access-token', token)
      .send(newPoll)
      .expect(201)

    expect(poll).to.have.interface({
      id: Number,
      username: String,
      question: String,
      slug: String,
      userId: Number,
      votes: Number,
      options: Array
    })

    const [ option ] = poll.options

    expect(option).to.have.interface({
      id: Number,
      value: String,
      pollId: Number,
      votes: Number
    })
  })

  it('can delete its own poll', async () => {

    await client
      .delete('/api/polls/2')
      .set('x-access-token', token)
      .expect(204)
  })

})
