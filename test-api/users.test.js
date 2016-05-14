
import { expect, rejected, begin } from '@thebearingedge/test-utils'
import { newUserSchema, userData, createUser } from '../src/api/users'
import { validate } from '../src/api/utils'
import { knex } from '../src/api/core'
import express from 'express'
import request from 'supertest'

describe('users', () => {

  describe('newUserSchema', () => {

    it('requires a string username', async () => {

      const user = { password: 'bar' }

      const err = await rejected(validate(user, newUserSchema))

      expect(err).to.be.an.instanceof(Error)
      expect(err).to.have.property('name', 'ValidationError')

      const [ invalid ] = err.details

      expect(invalid).to.have.property('path', 'username')
    })

    it('requires a string password', async () => {

      const user = { username: 'foo' }

      const err = await rejected(validate(user, newUserSchema))

      expect(err).to.be.an.instanceof(Error)
      expect(err).to.have.property('name', 'ValidationError')

      const [ invalid ] = err.details

      expect(invalid).to.have.property('path', 'password')
    })

  })

  describe('userData', () => {

    let trx, users

    beforeEach(begin(knex, _trx => {
      trx = _trx
      users = userData(trx)
    }))

    afterEach(() => trx.rollback())

    describe('create', () => {

      it('saves a new user', async () => {

        const username = 'thebearingedge'
        const password = 'foobarbaz'

        const user = await users.create({ username, password })

        expect(user).not.to.have.property('password')
        expect(user)
          .to.have.property('id')
          .that.is.a('number')
      })
    })
  })

  describe('createUser', () => {

    let app

    before(() => {

      const user = { id: 1, username: 'foo' }
      const users = { create: _ => Promise.resolve(user) }
      const handler = (req, res) => {
        expect(req.user).to.include(user)
        expect(req.user).not.to.have.property('password')
        res.end()
      }
      app = express()
        .get('/', createUser(users), handler)
    })

    it('sets the new user on req', async () => {

      const res = await request(app).get('/')

      expect(res).to.have.property('status', 200)
    })

  })

})
