
import { expect } from '@thebearingedge/test-utils'
import request from 'supertest-as-promised'
import express from 'express'
import jwt from 'jsonwebtoken'
import { tokenSecret } from '../../config'
import { knex, redis } from '../core'
import router from '../router'
import { Profile, Poll, PollListItem,
         Option, Vote } from '../fixtures/interfaces'


describe('an authenticated user', () => {

  let client, tokenHeaders

  before(async () => {

    await knex.seed.run()

    const app = express()
      .use('/api', router)

    const user = await knex
      .select('id', 'username')
      .from('users')
      .first()

    const token = jwt.sign(user, tokenSecret)

    tokenHeaders = { 'x-access-token': token }

    client = request(app)

    await redis.setAsync(token, token)
  })

  it('can see a user profile', async () => {

    const { body } = await client
      .get('/api/user/foo')
      .set(tokenHeaders)
      .expect(200)

    expect(body).to.have.interface(Profile)
  })

  it('can get a poll by username and slug', async () => {

    const { body } = await client
      .get('/api/user/foo/what-is-your-favorite-color')
      .set(tokenHeaders)
      .expect(200)

    expect(body).to.have.interface(Poll)
  })

  it('can see all polls', async () => {

    const { body } = await client
      .get('/api/polls')
      .set(tokenHeaders)
      .expect(200)

    expect(body[0]).to.have.interface(PollListItem)
  })

  it('can see any poll details', async () => {

    const { body } = await client
      .get('/api/polls/1')
      .set(tokenHeaders)
      .expect(200)

    expect(body).to.have.interface(Poll)
  })

  it('can vote on all polls', async () => {

    const { body } = await client
      .post('/api/vote')
      .set(tokenHeaders)
      .send({ optionId: 1 })
      .expect(201)

    expect(body).to.have.interface(Vote)
  })

  it('can add an option to their own poll', async () => {

    const { body } = await client
      .post('/api/polls/1/options')
      .set(tokenHeaders)
      .send({ value: 'yellow' })
      .expect(201)

    expect(body).to.have.interface(Option)
  })

  it('can create a new poll', async () => {

    const newPoll = {
      question: 'What is your favorite dog?',
      options: [{ value: 'Basenji' }, { value: 'Pom-Chi' } ]
    }

    const { body } = await client
      .post('/api/polls')
      .set(tokenHeaders)
      .send(newPoll)
      .expect(201)

    expect(body).to.have.interface(Poll)
  })

  it('cannot create a duplicate poll', async () => {

    const newPoll = {
      question: 'What is your favorite dog?',
      options: [{ value: 'Basenji' }, { value: 'Pom-Chi' } ]
    }

    await client
      .post('/api/polls')
      .set(tokenHeaders)
      .send(newPoll)
      .expect(400)
  })

  it('cannot create a duplicate poll option', async () => {

    const newOption = { value: 'red' }

    await client
      .post('/api/polls/1/options')
      .set(tokenHeaders)
      .send(newOption)
      .expect(400)
  })

  it('can delete its own poll', async () => {

    await client
      .delete('/api/polls/2')
      .set(tokenHeaders)
      .expect(204)
  })

  it('can logout', async () => {

    await client
      .delete('/api/authenticate')
      .set(tokenHeaders)
      .expect(204)
  })

})
