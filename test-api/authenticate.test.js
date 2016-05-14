
import { expect, stub } from '@thebearingedge/test-utils'
import { authenticate } from '../src/api/authenticate'
import { hash } from 'bcrypt-as-promised'
import errorHandler from '../src/api/error-handler'
import express from 'express'
import request from 'supertest'
import { json } from 'body-parser'

describe('authenticate', () => {

  const username = 'foo'
  const unhashed = 'bar'
  const user = { id: 1, username }
  let users, app, password

  before(async () => {
    users = {}
    app = express()
      .use(json())
      .post('/', authenticate(users), (req, res) => {
        expect(req.user).to.include(user)
        expect(req.user).not.to.have.property('password')
        res.end()
      })
      .use(errorHandler)
    password = await hash(unhashed)
  })

  beforeEach(() => {
    users.findByUsername = stub()
  })


  it('adds a user to req', async () => {

    users.findByUsername.resolves({ id: 1, username, password })

    const res = await request(app)
      .post('/')
      .send({ username: 'foo', password: unhashed })

    expect(res).to.have.property('status', 200)
  })

  context('when the user does not exist', () => {

    it('returns an Unauthorized error', async () => {

      users.findByUsername.resolves(null)

      const res = await request(app)
        .post('/')
        .send({ username: 'foo', password: unhashed })

      expect(res).to.have.property('status', 401)
    })

  })

  context('when the password does not match', () => {

    it('returns an Unauthorized error', async () => {

      users.findByUsername.resolves({ id: 1, username, password })

      const res = await request(app)
        .post('/')
        .send({ username: 'foo', password: 'bad password' })

      expect(res).to.have.property('status', 401)
    })
  })


})
