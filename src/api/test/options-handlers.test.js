
import { expect, stub, request } from '@thebearingedge/test-utils'
import express from 'express'
import { errorHandler } from '../errors'
import { optionsData } from '../options-data'
import { postOption } from '../options-handlers'


const mockOption = { value: 'yellow' }


describe('options-handlers', () => {

  describe('postOption', () => {

    let options, client

    before(() => {

      options = optionsData()

      const app = express()
        .post('/options', postOption(options))
        .use(errorHandler)

      client = request(app)
    })

    beforeEach(() => stub(options, 'create'))

    afterEach(() => options.create.restore())

    it('adds an option to a poll', async () => {

      options.create.resolves({ id: 4, votes: 0, ...mockOption })

      const res = await client
        .post('/options')
        .send({ value: 'yellow' })

      expect(res).to.have.property('status', 201)
      expect(res.body).to.have.interface({ id: Number, votes: Number })
    })

  })

})
