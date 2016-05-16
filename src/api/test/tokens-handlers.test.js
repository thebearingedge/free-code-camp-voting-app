
import { expect, stub } from '@thebearingedge/test-utils'
import request from 'supertest-as-promised'
import express from 'express'
import jwt from 'jsonwebtoken'
import { tokensData } from '../tokens-data'
import { errorHandler } from '../errors'
import { tokenSecret } from '../../config'
import { issueToken } from '../tokens-handlers'


describe('tokens-handlers', () => {

  let tokens, client

  before(() => {

    tokens = tokensData()

    const app = express()
      .use((req, res, next) =>
        (req.user = { id: 1, username: 'foo' }) && next()
      )
      .post('/login', issueToken(tokens))
      .use(errorHandler)

    client = request(app)
  })

  beforeEach(() => stub(tokens, 'save'))

  afterEach(() => tokens.save.restore())

  describe('issueToken', () => {

    it('creates a webtoken from req.user', async () => {

      const res = await client.post('/login')

      expect(res).to.have.property('status', 201)
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
