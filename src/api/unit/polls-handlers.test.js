
import { expect, stub, request } from '@thebearingedge/test-utils'
import express from 'express'
import { errorHandler } from '../errors'
import { pollsData } from '../polls-data'
import { getPolls, getPoll, postPoll, deletePoll } from '../polls-handlers'


const mockPoll = {
  question: 'What is your favorite dog?',
  options: [{ value: 'Basenji' }, { value: 'Pom-Chi'}]
}

describe('polls-handlers', () => {

  const polls = pollsData()
  const setUser = (req, _, next) => (req.user = { id: 1 }) && next()
  const app = express()
    .get('/polls', getPolls(polls))
    .post('/polls', setUser, postPoll(polls))
    .delete('/polls/:pollId', deletePoll(polls))
    .get('/polls/:pollId', getPoll(polls))
    .use(errorHandler)
  const client = request(app)

  describe('getPolls', () => {

    beforeEach(() => stub(polls, 'list'))

    afterEach(() => polls.list.restore())

    it('responds with a list of polls', async () => {

      polls.list.resolves([{ id: 1, ...mockPoll }])

      const { body: results } = await client
        .get('/polls')
        .expect(200)

      expect(results).to.have.property('length', 1)
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

    beforeEach(() => stub(polls, 'create'))

    afterEach(() => polls.create.restore())

    it('handles new polls', async () => {

      await client
        .post('/polls')
        .send(mockPoll)
        .expect(201)
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

})
