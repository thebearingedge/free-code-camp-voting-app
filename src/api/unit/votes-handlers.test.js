
import { expect, stub, request } from '@thebearingedge/test-utils'
import express from 'express'
import { json } from 'body-parser'
import { votesData } from '../votes-data'
import { errorHandler } from '../errors'
import { postVote } from '../votes-handlers'

describe('votes-handlers', () => {

  describe('postVote', () => {

    const votes = votesData()
    const app = express()
      .use(json())
      .post('/votes', postVote(votes))
      .use(errorHandler)
    const client = request(app)

    beforeEach(() => {
      stub(votes, 'create')
      stub(votes, 'optionExists')
    })

    afterEach(() => {
      votes.create.restore()
      votes.optionExists.restore()
    })

    context('when an option exists', () => {

      it('adds a vote', async () => {

        votes.optionExists.resolves(true)
        votes.create.resolves({ id: 1, optionId: 1, date: '2016-01-01' })

        const res = await client
          .post('/votes')
          .send({ optionId: 1 })
          .expect(201)

        expect(res.body).to.have.interface({
          id: Number,
          optionId: Number,
          date: String
        })
      })

    })

    context('when an option does not exist', () => {

      it('returns a BadRequest error', async () => {

        votes.optionExists.resolves(false)

        const res = await client
          .post('/votes')
          .send({ optionId: 1000 })
          .expect(400)

        expect(res.body).to.have.property('error', 'Bad Request')
      })

    })

  })

})
