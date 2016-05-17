
import { expect, stub, request } from '@thebearingedge/test-utils'
import express from 'express'
import jwt from 'jsonwebtoken'
import { tokensData } from '../tokens-data'
import { errorHandler } from '../errors'
import { tokenSecret, tokenExpiry } from '../../config'
import { protect } from '../tokens-middleware'


describe('tokens-middleware', () => {

  let tokens, client, goodToken, badToken

  before(async () => {

    tokens = tokensData()

    const app = express()
      .get('/protected', protect(tokens), ({ user }, res) => {
        expect(user).to.include({ id: 1, username: 'foo' })
        res.end()
      })
      .use(errorHandler)

    client = request(app)

    goodToken = jwt.sign({ id: 1, username: 'foo' }, tokenSecret)
    badToken = jwt.sign({ id: 666 }, 'fake-secret')
  })

  beforeEach(() => {
    stub(tokens, 'get')
    stub(tokens, 'set')
  })

  afterEach(() => {
    tokens.get.restore()
    tokens.set.restore()
  })

  describe('protect', () => {

    context('when no token is included', () => {

      it('returns a Forbidden error', async () => {

        const res = await client.get('/protected')

        expect(res).to.have.property('status', 403)
        expect(res.body).to.have.property('error', 'Forbidden')
      })

    })

    context('when an unknown token is included', () => {

      it('returns a Forbidden error', async () => {

        tokens.get.resolves(null)

        const res = await client
          .get('/protected')
          .set('x-access-token', goodToken)

        expect(res).to.have.property('status', 403)
        expect(res.body).to.have.property('error', 'Forbidden')
      })

    })

    context('when a token is not trusted', () => {

      it('returns a Forbidden error', async () => {

        tokens.get.resolves(badToken)

        const res = await client
          .get('/protected')
          .set('x-access-token', badToken)

        expect(res).to.have.property('status', 403)
        expect(res.body).to.have.property('error', 'Forbidden')
      })

    })

    context('when a valid token is included', () => {

      it('decodes the user and resaves the token', async () => {

        tokens.get.resolves(goodToken)

        const res = await client
          .get('/protected')
          .set('x-access-token', goodToken)

        expect(res).to.have.property('status', 200)
        expect(tokens.set)
          .to.have.been.calledWithExactly(goodToken, tokenExpiry, goodToken)
      })

    })

  })

})
