
import { expect, stub, request } from '@thebearingedge/test-utils'
import express from 'express'
import { json } from 'body-parser'
import { optionsData } from '../options-data'
import { errorHandler } from '../errors'
import { postVote } from '../votes-handlers'

describe('votes-handlers', () => {

  describe('postVote', () => {

    const options = optionsData()
    const app = express()
      .use(json())
      .post('/vote', postVote(options))
      .use(errorHandler)
    const client = request(app)

    beforeEach(() => {
      stub(options, 'addVote')
      stub(options, 'optionExists')
    })

    afterEach(() => {
      options.addVote.restore()
      options.optionExists.restore()
    })

    context('when an option exists', () => {

      it('adds a vote', async () => {

        options.optionExists.resolves(true)
        options.addVote.resolves({ id: 1, optionId: 1, date: '2016-01-01' })

        await client
          .post('/vote')
          .send({ optionId: 1 })
          .expect(201)
      })

    })

    context('when an option does not exist', () => {

      it('returns a Bad Request error', async () => {

        options.optionExists.resolves(false)

        const res = await client
          .post('/vote')
          .send({ optionId: 1000 })
          .expect(400)

        expect(res.body).to.have.property('error', 'Bad Request')
      })

    })

  })

})
