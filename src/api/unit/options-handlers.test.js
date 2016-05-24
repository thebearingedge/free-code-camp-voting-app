
import { expect, stub } from '@thebearingedge/test-utils'
import request from 'supertest-as-promised'
import express from 'express'
import { json } from 'body-parser'
import { errorHandler } from '../errors'
import { optionsData } from '../options-data'
import { postOption } from '../options-handlers'


describe('options-handlers', () => {

  const mockOption = { value: 'yellow' }

  const options = optionsData()

  const app = express()
    .use(json())
    .post('/options', postOption(options))
    .use(errorHandler)

  const client = request(app)

  describe('postOption', () => {

    beforeEach(() => {
      stub(options, 'create')
      stub(options, 'valueExists')
    })

    afterEach(() => {
      options.create.restore()
      options.valueExists.restore()
    })

    context('when the option does not already exist', () => {

      it('adds an option to a poll', async () => {

        options.valueExists.resolves(false)
        options.create.resolves()

        await client
          .post('/options')
          .send(mockOption)
          .expect(201)
      })
    })

    context('when the option already exists', () => {

      it('returns a Bad Request error', async () => {

        options.valueExists.resolves(true)

        const { body } = await client
          .post('/options')
          .send(mockOption)
          .expect(400)

        expect(body).to.have.property('error', 'Bad Request')
      })

    })

  })

})
