
import { expect, stub, request } from '@thebearingedge/test-utils'
import express from 'express'
import jwt from 'jsonwebtoken'
import { tokensData } from '../tokens-data'
import { errorHandler } from '../errors'
import { tokenSecret } from '../../config'
import { issueToken } from '../tokens-handlers'


describe('tokens-handlers', () => {

  const tokens = tokensData()
  const app = express()
    .use((_, res, next) =>
      (res.locals.user = { id: 1, username: 'foo' }) && next()
    )
    .post('/login', issueToken(tokens))
    .use(errorHandler)
  const client = request(app)

  beforeEach(() => stub(tokens, 'set'))

  afterEach(() => tokens.set.restore())

  describe('issueToken', () => {

    it('creates a webtoken from req.user', async () => {

      const res = await client
        .post('/login')
        .expect(201)

      expect(res.body).to.have.interface({
        id: Number,
        username: String,
        token: String
      })

      const verified = jwt.verify(res.body.token, tokenSecret)

      expect(verified).to.include({
        id: 1,
        username: 'foo'
      })
    })

  })

})
