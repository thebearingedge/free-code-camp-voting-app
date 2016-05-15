
import { expect } from '@thebearingedge/test-utils'
import express from 'express'
import request from 'supertest-as-promised'
import { errorHandler, NotFound } from '../errors'


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
