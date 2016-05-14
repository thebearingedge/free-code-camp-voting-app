
import { expect, rejected, begin, stub } from '@thebearingedge/test-utils'
import * as polls from '../src/api/polls'
import { validate } from '../src/api/utils'
import { knex } from '../src/api/core'
import express from 'express'
import request from 'supertest-as-promised'
import errorHandler from '../src/api/error-handler'

const mockPoll = {
  question: 'What is your favorite dog?',
  options: [{ value: 'Basenji' }, { value: 'Pom-Chi'}]
}

describe('polls', () => {

  const { optionSchema } = polls

  describe('optionSchema', () => {

    it('requires a string "value"', async () => {

      const option = { value: {} }

      const err = await rejected(validate(option, optionSchema))

      expect(err).to.have.property('name', 'ValidationError')

      const [ invalid ] = err.details

      expect(invalid).to.have.property('path', 'value')
    })

  })


  const { pollSchema } = polls

  describe('pollSchema', () => {

    it('requires a string "question"', async () => {

      const poll = { options: [{ value: 'foo' }] }

      const err = await rejected(validate(poll, pollSchema))

      expect(err).to.have.property('name', 'ValidationError')

      const [ invalid ] = err.details

      expect(invalid).to.have.property('path', 'question')
    })

    it('requires an array of "options" (minimum 1)', async () => {

      const poll = {
        question: 'What is your favorite color?',
        options: []
      }

      const err = await rejected(validate(poll, pollSchema))

      expect(err).to.have.property('name', 'ValidationError')

      const [ invalid ] = err.details

      expect(invalid).to.have.property('path', 'options')
    })
  })


  const { pollsData } = polls

  describe('pollsData', () => {

    let trx, polls

    beforeEach(begin(knex, _trx => {
      trx = _trx
      polls = pollsData(trx)
    }))

    afterEach(() => trx.rollback())

    describe('findByUserAndSlug', () => {

      it('fetches a poll and loads its options, including "votes"', async () => {

        const poll = await polls
          .findByUserAndSlug('foo', 'what-is-your-favorite-color')

        expect(poll).to.have.interface({
          id: Number,
          question: String,
          options: Array
        })

        const [ option ] = poll.options

        expect(option).to.have.interface({
          id: Number,
          value: String,
          votes: Number
        })
      })

      it('returns null if a poll is not found', async () => {

        const poll = await polls
          .findByUserAndSlug('bar', 'what-is-your-favorite-dog')

        expect(poll).to.be.null
      })

    })

    describe('create', () => {

      it('inserts a poll and its options for a username', async () => {

        const user = { id: 1, username: 'foo' }
        const poll = mockPoll

        const saved = await polls.createForUser(user, poll)

        expect(saved).to.have.interface({
          id: Number,
          user: String,
          question: String,
          slug: String,
          options: Array
        })

        const [ option ] = saved.options

        expect(option).to.have.interface({
          id: Number,
          pollId: Number,
          value: String,
          votes: Number
        })
      })

    })

    describe('vote', () => {

      it('adds a vote to a poll option', async () => {

        const option = await polls.vote(1)

        expect(option).to.have.property('votes', 1)
      })

    })

  })


  const { postPoll } = polls

  describe('postPoll', () => {

    let app, polls, setUser

    before(() => {
      setUser = (req, res, next) =>
        (req.user = { id: 1, username: 'foo' }) && next()
      polls = {}
      app = express()
        .use(setUser)
        .post('/', postPoll(polls))
    })

    beforeEach(() => {
      polls.createForUser = stub()
    })

    it('handles new polls', async () => {

      polls.createForUser.resolves({})

      const res = await request(app)
        .post('/')
        .send(mockPoll)

      expect(res).to.have.property('status', 201)
    })
  })


  const { getPoll } = polls

  describe('getPoll', () => {

    let app, polls

    before(() => {
      polls = {}
      app = express()
        .get('/', getPoll(polls))
        .use(errorHandler)
    })

    beforeEach(() => {
      polls.findByUserAndSlug = stub()
    })

    it('responds with a saved poll', async () => {

      polls.findByUserAndSlug.resolves(mockPoll)

      const res = await request(app).get('/')

      expect(res).to.have.property('status', 200)
    })

    it('sends a NotFound error', async () => {

      polls.findByUserAndSlug.resolves(null)

      const res = await request(app).get('/')

      expect(res).to.have.property('status', 404)
      expect(res.body).to.have.property('error', 'NotFound')
    })

  })


  const { voteInPoll } = polls

  describe('voteInPoll', () => {

    let polls, client

    before(() => {
      polls = {}
      const app = express()
        .post('/', voteInPoll(polls))
        .use(errorHandler)
      client = request(app)
    })

    beforeEach(() => {
      polls.vote = stub()
      polls.findOptionById = stub()
      polls.findByUserAndSlug = stub()
    })

    it('registers a vote for a poll option', async () => {

      polls.findByUserAndSlug.resolves(true)
      polls.findOptionById.resolves(true)
      polls.vote.resolves({ votes: 1 })

      const res = await client.post('/')

      expect(res).to.have.property('status', 201)
      expect(res.body).to.have.interface({
        votes: Number
      })
    })

    context('when a poll does not exist', () => {

      it('returns a NotFound error', async () => {

        polls.findByUserAndSlug.resolves(null)

        const res = await client.post('/')

        expect(res).to.have.property('status', 404)
        expect(res.body).to.have.property('error', 'NotFound')
      })

    })

    context('when a poll option does not exist', () => {

      it('returns a NotFound error', async () => {

        polls.findByUserAndSlug.resolves(true)
        polls.findOptionById.resolves(null)

        const res = await client.post('/')

        expect(res).to.have.property('status', 404)
        expect(res.body).to.have.property('error', 'NotFound')
      })

    })

  })

})
