
import { expect, stub, request } from '@thebearingedge/test-utils'
import express from 'express'
import { json } from 'body-parser'
import { errorHandler } from '../errors'
import { pollsData } from '../polls-data'
import { getPolls, getPoll,
         postPoll, deletePoll, getPollByUserSlug } from '../polls-handlers'


describe('polls-handlers', () => {

  const mockPoll = {
    question: 'What is your favorite dog?',
    options: [{ value: 'Basenji' }, { value: 'Pom-Chi'}]
  }

  const polls = pollsData()

  const protect = _ => (_, res, next) =>

    (res.locals.user = { id: 1 }) && next()

  const app = express()
    .use(json())
    .get('/polls', getPolls(polls))
    .post('/polls', protect(), postPoll(polls))
    .delete('/polls/:pollId', deletePoll(polls))
    .get('/polls/:pollId', getPoll(polls))
    .get('/user/:username/:slug', getPollByUserSlug(polls))
    .use(errorHandler)

  const client = request(app)

  describe('getPolls', () => {

    beforeEach(() => stub(polls, 'list'))

    afterEach(() => polls.list.restore())

    it('responds with a list of polls', async () => {

      polls.list.resolves([{ id: 1, ...mockPoll }])

      const { body } = await client
        .get('/polls')
        .expect(200)

      expect(body).to.have.property('length', 1)
    })
  })

  describe('getPoll', () => {

    beforeEach(() => stub(polls, 'findById'))

    afterEach(() => polls.findById.restore())

    it('responds with a saved poll', async () => {

      polls.findById.resolves({ id: 1, ...mockPoll })

      const { body: poll } = await client
        .get('/polls/1')
        .expect(200)

      expect(poll).to.have.property('id', 1)
      expect(polls.findById).to.have.been.calledWith('1')
    })

    it('sends a NotFound error', async () => {

      polls.findById.resolves(null)

      const res = await client
        .get('/polls/2')
        .expect(404)

      expect(res.body).to.have.property('error', 'Not Found')
      expect(polls.findById).to.have.been.calledWith('2')
    })

  })

  describe('postPoll', () => {

    beforeEach(() => {
      stub(polls, 'create')
      stub(polls, 'pollExists')
    })

    afterEach(() => {
      polls.create.restore()
      polls.pollExists.restore()
    })

    context('when a poll does not already exist', () => {

      it('handles new polls', async () => {

        await client
          .post('/polls')
          .send(mockPoll)
          .expect(201)
      })
    })

    context('when a poll already exists', () => {

      it('returns a Bad Request error', async () => {

        polls.pollExists.resolves(true)

        const { body } = await client
          .post('/polls')
          .send(mockPoll)
          .expect(400)

        expect(body).to.have.property('error', 'Bad Request')
      })
    })

  })

  describe('deletePoll', () => {

    beforeEach(() => stub(polls, 'deleteById'))

    afterEach(() => polls.deleteById.restore())

    it('deletes a poll', async () => {

      await client
        .delete('/polls/1')
        .expect(204)
    })

  })

  describe('getPollByUserSlug', () => {

    beforeEach(() => stub(polls, 'findByUserSlug'))

    afterEach(() => polls.findByUserSlug.restore())

    context('when a poll exists', () => {

      it('sends the poll', async () => {

        polls.findByUserSlug.resolves({ question: 'yay' })

        await client
          .get('/user/foo/whats-up')
          .expect(200)
      })

    })

    context('when a poll does not exist', () => {

      it('returns a Not Found error', async () => {

        polls.findByUserSlug.resolves(null)

        await client
          .get('/user/foo/whats-up')
          .expect(404)
      })

    })

  })

})
