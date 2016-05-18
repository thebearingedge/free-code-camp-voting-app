
import { expect, request } from '@thebearingedge/test-utils'
import express from 'express'
import { knex } from '../core'
import api from '../'

describe('an unauthenticated user', () => {

  let client

  before(async () => {

    await knex.seed.run()

    const app = express()
      .use('/api', api)

    client = request(app)
  })

  it('can see all polls', async () => {

    const { body: polls } = await client
      .get('/api/polls')
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
      .expect(200)

    expect(poll).to.have.interface({
      id: Number,
      username: String,
      question: String,
      slug: String,
      userId: Number,
      votes: Number,
      options: Object
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
      .send({ optionId: 1 })
      .expect(201)

    expect(vote).to.have.interface({
      id: Number,
      optionId: Number,
      date: String
    })
  })

  it('can sign up', async () => {

    const { body } = await client
      .post('/api/signup')
      .send({ username: 'bar', password: 'baz' })
      .redirects(1)
      .expect(201)

    expect(body).to.have.interface({
      id: Number,
      username: String,
      token: String
    })
  })

  it('can authenticate', async () => {

    const { body } = await client
      .post('/api/authenticate')
      .send({ username: 'foo', password: 'bar' })
      .expect(201)

    expect(body).to.have.interface({
      id: Number,
      username: String,
      token: String
    })
  })

  it('cannot create a new poll', async () => {

    const newPoll = {
      question: 'What is your favorite dog?',
      options: [{ value: 'Basenji' }, { value: 'Pom-Chi' } ]
    }

    await client
      .post('/api/polls')
      .send(newPoll)
      .expect(403)
  })

  it('cannot delete a poll', async () => {

    await client
      .delete('/api/polls/1')
      .expect(403)
  })

  it('cannot revise a poll', async () => {

    await client
      .post('/api/polls/1/options')
      .send({ value: 'yellow' })
      .expect(403)
  })

})
