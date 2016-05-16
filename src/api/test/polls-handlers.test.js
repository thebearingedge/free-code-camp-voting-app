
import { expect, stub, request } from '@thebearingedge/test-utils'
import express from 'express'
import { errorHandler } from '../errors'
import { pollsData } from '../polls-data'
import { getPoll, postPoll, deletePoll } from '../polls-handlers'


const mockPoll = {
  question: 'What is your favorite dog?',
  options: [{ value: 'Basenji' }, { value: 'Pom-Chi'}]
}

describe('polls-handlers', () => {

  let polls = pollsData()

  describe('getPoll', () => {

    let client

    before(() => {

      const app = express()
        .get('/polls/:pollId', getPoll(polls))
        .use(errorHandler)

      client = request(app)
    })

    beforeEach(() => stub(polls, 'findById'))

    afterEach(() => polls.findById.restore())

    it('responds with a saved poll', async () => {

      polls.findById.resolves(mockPoll)

      const res = await client.get('/polls/1')

      expect(res).to.have.property('status', 200)
      expect(polls.findById).to.have.been.calledWith('1')
    })

    it('sends a NotFound error', async () => {

      polls.findById.resolves(null)

      const res = await client.get('/polls/2')

      expect(res).to.have.property('status', 404)
      expect(res.body).to.have.property('error', 'Not Found')
      expect(polls.findById).to.have.been.calledWith('2')

    })

  })

  describe('postPoll', () => {

    let client

    before(() => {

      const app = express()
        .post('/polls', postPoll(polls))
        .use(errorHandler)

      client = request(app)
    })

    beforeEach(() => stub(polls, 'create'))

    afterEach(() => polls.create.restore())

    it('handles new polls', async () => {

      polls.create.resolves({})

      const res = await client
        .post('/polls')
        .send(mockPoll)

      expect(res).to.have.property('status', 201)
    })

  })


  describe('deletePoll', () => {

    let client

    before(() => {

      const app = express()
        .delete('/polls/:pollId', deletePoll(polls))
        .use(errorHandler)

      client = request(app)
    })

    beforeEach(() => stub(polls, 'deleteById'))

    afterEach(() => polls.deleteById.restore())

    it('deletes a poll', async () => {

      const res = await client.delete('/polls/1')

      expect(res).to.have.property('status', 204)
    })

  })

})
