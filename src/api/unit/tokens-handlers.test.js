
import { expect, stub, request } from '@thebearingedge/test-utils'
import express from 'express'
import jwt from 'jsonwebtoken'
import { tokensData } from '../tokens-data'
import { errorHandler } from '../errors'
import { tokenSecret } from '../../config'
import { Auth } from '../fixtures/interfaces'
import { issueToken, deleteToken } from '../tokens-handlers'


describe('tokens-handlers', () => {

  const tokens = tokensData()

  const app = express()
    .use((_, res, next) =>
      (res.locals.user = { id: 1, username: 'foo' }) && next()
    )
    .post('/authenticate', issueToken(tokens))
    .delete('/authenticate', deleteToken(tokens))
    .use(errorHandler)

  const client = request(app)

  beforeEach(() => {
    stub(tokens, 'set')
    stub(tokens, 'unset')
  })

  afterEach(() => {
    tokens.set.restore()
    tokens.unset.restore()
  })

  describe('issueToken', () => {

    it('creates a webtoken from req.user', async () => {

      const { body } = await client
        .post('/authenticate')
        .expect(201)

      expect(body).to.have.interface(Auth)

      const verified = jwt.verify(body.token, tokenSecret)

      expect(verified).to.include({
        id: 1,
        username: 'foo'
      })
    })

  })

  describe('deleteToken', () => {

    it('deletes the included webtoken', async () => {

      await client
        .delete('/authenticate')
        .set('x-access-token', 'foo')
        .expect(204)
    })
  })

})
