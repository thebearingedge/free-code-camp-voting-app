
import { expect, rejected } from '@thebearingedge/test-utils'
import express from 'express'
import request from 'supertest-as-promised'
import * as tokens from '../src/api/tokens'
import errorHandler from '../src/api/error-handler'


const { createToken, verifyToken, issueToken, setUser } = tokens


describe('tokens', () => {

  describe('createToken', () => {

    context('when a valid payload is provided', () => {

      it('creates a web token', async () => {

        const token = await createToken({ id: 1, username: 'foo' })

        expect(token).to.be.a('string')
      })
    })

    context('when no payload is provided', () => {

      it('throws a ValidationError', async () => {

        const err = await rejected(createToken())

        expect(err).to.be.an.instanceOf(Error)
        expect(err).to.have.property('message', 'payload is required')
      })
    })
  })


  describe('verifyToken', () => {

    let token

    before(async () => {

      token = await createToken({ id: 1, username: 'foo' })
    })

    context('when a valid token is passed', () => {

      it('decodes the token', async () => {

        const user = await verifyToken(token)

        expect(user).to.include({ id: 1, username: 'foo' })
      })
    })

    context('when an invalid token is passed', () => {

      it('throws a JsonWebTokenError', async () => {

        const err = await rejected(verifyToken(null))

        expect(err).to.have.property('name', 'JsonWebTokenError')
      })
    })
  })


  describe('issueToken', () => {

    let app, setUser, redis, user

    before(() => {
      app = express()
      user = { id: 1, username: 'foo' }
      setUser = (req, res, next) => {
        req.user = user
        next()
      }
      redis = { setexAsync: _ => Promise.resolve() }
      app.use('/', setUser, issueToken(redis))
    })

    it('sends a token encoded from req.user', async () => {

      const { body } = await request(app)
        .get('/')

      expect(body)
        .to.have.property('token')
        .that.is.a('string')
    })
  })

  describe('setUser', () => {

    let app, redis, user, token

    beforeEach(() => {
      redis.getAsync = _ => Promise.resolve(token)
      redis.setexAsync = _ => Promise.resolve()
    })

    before(async () => {
      app = express()
      user = { id: 1, username: 'foo' }
      token = await createToken(user)
      redis = {}
      app
        .get('/', setUser(redis), (req, res) => {
          expect(req.user).to.include(user)
          res.end()
        })
        .use(errorHandler)
    })

    context('when a valid token is included in headers', () => {

      it('sets a decoded user on the request', async () => {

        const res = await request(app)
          .get('/')
          .set({ 'x-access-token': token })

        expect(res).to.have.property('status', 200)
      })
    })

    context('when an unknown token is included in headers', () => {

      it('returns an Unauthorized error', async () => {

        redis.getAsync = _ => null

        const res = await request(app)
          .get('/')
          .set({ 'x-access-token': 'foobar' })

        expect(res).to.have.property('status', 401)
      })

    })

    context('when no token is included in headers', () => {

      it('returns an Unauthorized error', async () => {

        const res = await request(app).get('/')

        expect(res).to.have.property('status', 401)
      })

    })

    context('when a bad token is included in headers', () => {

      it('returns an Unauthorized error', async () => {

        redis.getAsync = _ => 'bad'

        const res = await request(app)
          .get('/')
          .set({ 'x-access-token': 'bad' })

        expect(res).to.have.property('status', 401)
      })

    })

  })
})
