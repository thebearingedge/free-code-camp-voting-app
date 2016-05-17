
import { expect, request } from '@thebearingedge/test-utils'
import express from 'express'
import { errorHandler, NotFound, ValidationError } from '../errors'


describe('errors', () => {

  describe('errorHandler', () => {

    const error = {}

    const app = express()
      .use((req, res) => error.throw())
      .use(errorHandler)

    const client = request(app)

    context('when a ClientError is thrown', () => {

      it('sends the corresponding response', async () => {

        error.throw = function () { throw new NotFound('boo') }

        const res = await client.get('/')

        expect(res).to.have.property('status', 404)
        expect(res.body).to.have.interface({
          error: String,
          message: String,
          statusCode: Number
        })
      })

    })

    context('when a ValidationError is thrown', () => {

      it('sends a Bad Request error', async () => {

        error.throw = function () { throw new ValidationError() }

        const res = await client.get('/')

        expect(res).to.have.property('status', 400)
        expect(res.body).to.have.property('error', 'Bad Request')
      })
    })

    context('when a server error is thrown', () => {

      it('sends an Internal Server Error', async () => {

        error.throw = function () { throw new Error('boo') }

        const res = await client.get('/')

        expect(res).to.have.property('status', 500)
        expect(res.body).to.have.interface({
          error: String
        })
      })

    })

  })

})
