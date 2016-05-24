
import { expect, stub } from '@thebearingedge/test-utils'
import request from 'supertest-as-promised'
import express from 'express'
import jwt from 'jsonwebtoken'
import { tokensData } from '../tokens-data'
import { errorHandler } from '../errors'
import { tokenSecret, tokenExpiry } from '../../config'
import { protect } from '../tokens-middleware'


describe('tokens-middleware', () => {

  const mockUser = { id: 1, username: 'foo' }
  const goodToken = jwt.sign(mockUser, tokenSecret)
  const badToken = jwt.sign({ id: 666 }, 'fake-secret')

  const tokens = tokensData()

  const app = express()
    .get('/protected', protect(tokens), (_, res) =>

      expect(res.locals.user).to.include(mockUser) && res.end()
    )
    .use(errorHandler)

  const client = request(app)

  beforeEach(() => {
    stub(tokens, 'get')
    stub(tokens, 'set')
    stub(tokens, 'unset')
  })

  afterEach(() => {
    tokens.get.restore()
    tokens.set.restore()
    tokens.unset.restore()
  })

  describe('protect', () => {

    context('when no token is included', () => {

      it('returns a Forbidden error', async () => {

        const { body } = await client
          .get('/protected')
          .expect(403)

        expect(body).to.have.property('error', 'Forbidden')
      })

    })

    context('when an unknown token is included', () => {

      it('returns a Forbidden error', async () => {

        tokens.get.resolves(null)

        const { body } = await client
          .get('/protected')
          .set('x-access-token', goodToken)
          .expect(403)

        expect(body).to.have.property('error', 'Forbidden')
      })

    })

    context('when a token is not trusted', () => {

      it('returns a Forbidden error', async () => {

        tokens.get.resolves(badToken)

        const { body } = await client
          .get('/protected')
          .set('x-access-token', badToken)
          .expect(403)

        expect(body).to.have.property('error', 'Forbidden')
        expect(tokens.unset).to.have.been.calledWithExactly(badToken)
      })

    })

    context('when a valid token is included', () => {

      it('decodes the user and resaves the token', async () => {

        tokens.get.resolves(goodToken)

        await client
          .get('/protected')
          .set('x-access-token', goodToken)
          .expect(200)

        expect(tokens.set)
          .to.have.been.calledWithExactly(goodToken, tokenExpiry, goodToken)
      })

    })

  })

})
