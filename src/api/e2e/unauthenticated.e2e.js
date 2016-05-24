
import { expect } from '@thebearingedge/test-utils'
import request from 'supertest-as-promised'
import express from 'express'
import { knex } from '../core'
import router from '../router'
import { Profile, Poll, PollListItem, Auth, Vote } from '../fixtures/interfaces'


describe('an unauthenticated user', () => {

  let client

  before(async () => {

    await knex.seed.run()

    const app = express()
      .use('/api', router)

    client = request(app)
  })

  it('can see all polls', async () => {

    const { body } = await client
      .get('/api/polls')
      .expect(200)

    expect(body[0]).to.have.interface(PollListItem)
  })

  it('can see a user profile', async () => {

    const { body } = await client
      .get('/api/user/foo')
      .expect(200)

    expect(body).to.have.interface(Profile)
  })

  it('can get a poll by username and slug', async () => {

    const { body } = await client
      .get('/api/user/foo/what-is-your-favorite-color')
      .expect(200)

    expect(body).to.have.interface(Poll)
  })

  it('can see any poll details', async () => {

    const { body } = await client
      .get('/api/polls/1')
      .expect(200)

    expect(body).to.have.interface(Poll)
  })

  it('can vote on all polls', async () => {

    const { body } = await client
      .post('/api/vote')
      .send({ optionId: 1 })
      .expect(201)

    expect(body).to.have.interface(Vote)
  })

  it('can sign up', async () => {

    const { body } = await client
      .post('/api/signup')
      .send({ username: 'bar', password: 'baz' })
      .redirects(1)
      .expect(201)

    expect(body).to.have.interface(Auth)
  })

  it('can authenticate', async () => {

    const { body } = await client
      .post('/api/authenticate')
      .send({ username: 'foo', password: 'bar' })
      .expect(201)

    expect(body).to.have.interface(Auth)
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
