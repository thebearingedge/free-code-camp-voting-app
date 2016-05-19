
import { expect, stub, request } from '@thebearingedge/test-utils'
import express from 'express'
import { errorHandler } from '../errors'
import { optionsData } from '../options-data'
import { Option } from '../fixtures/interfaces'
import { postOption } from '../options-handlers'


describe('options-handlers', () => {

  const mockOption = { pollId: 1, value: 'yellow' }

  const options = optionsData()

  const app = express()
    .post('/options', postOption(options))
    .use(errorHandler)

  const client = request(app)

  describe('postOption', () => {

    beforeEach(() => stub(options, 'create'))

    afterEach(() => options.create.restore())

    it('adds an option to a poll', async () => {

      options.create.resolves({ id: 4, votes: 0, ...mockOption })

      const { body } = await client
        .post('/options')
        .send(mockOption)
        .expect(201)

      expect(body).to.have.interface(Option)
    })

  })

})
