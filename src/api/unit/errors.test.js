
import { expect, request, stub } from '@thebearingedge/test-utils'
import express from 'express'
import wrap from 'express-async-wrap'
import { errorHandler, notFoundHandler,
         Forbidden, ValidationError } from '../errors'


describe('errors', () => {

  const error = { throw: function () {} }

  const app = express()
    .use('/', wrap(async (_, __, next) => error.throw(next)))
    .use('*', notFoundHandler)
    .use(errorHandler)

  const client = request(app)

  beforeEach(() => stub(error, 'throw'))

  afterEach(() => error.throw.restore())

  describe('errorHandler', () => {

    context('when a ClientError is thrown', () => {

      it('sends the corresponding response', async () => {

        error.throw.throws(new Forbidden('boo'))

        const res = await client
          .get('/')
          .expect(403)

        expect(res.body).to.have.interface({
          error: String,
          message: String,
          statusCode: Number
        })
      })

    })

    context('when a ValidationError is thrown', () => {

      it('sends a Bad Request error', async () => {

        error.throw.throws(new ValidationError('boo'))

        const { body } = await client
          .get('/')
          .expect(400)

        expect(body).to.have.property('error', 'Bad Request')
      })
    })

    context('when a server error is thrown', () => {

      it('sends an Internal Server Error', async () => {

        error.throw.throws(new Error('boo'))

        const { body } = await client
          .get('/')
          .expect(500)

        expect(body).to.have.interface({
          error: String,
          statusCode: Number
        })
      })

    })

  })

  describe('notFoundHandler', () => {

    it('returns a JSON 404 body', async () => {

      error.throw.callsArg(0)

      const { body } = await client
        .get('/jar-jar-binks')
        .expect(404)

      expect(body).to.have.interface({
        statusCode: Number,
        error: String,
        message: String
      })
    })
  })

})
