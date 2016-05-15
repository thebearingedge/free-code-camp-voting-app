
import { expect, rejected, begin, stub } from '@thebearingedge/test-utils'
import * as users from '../src/api/users'
import { validate } from '../src/api/utils'
import { knex } from '../src/api/core'
import errorHandler from '../src/api/error-handler'
import express from 'express'
import request from 'supertest'

describe('users', () => {

  const { userSchema } = users

  describe('userSchema', () => {

    it('requires a string username', async () => {

      const user = { password: 'bar' }

      const err = await rejected(validate(user, userSchema))

      expect(err).to.be.an.instanceof(Error)
      expect(err).to.have.property('name', 'ValidationError')

      const [ invalid ] = err.details

      expect(invalid).to.have.property('path', 'username')
    })

    it('requires a string password', async () => {

      const user = { username: 'foo' }

      const err = await rejected(validate(user, userSchema))

      expect(err).to.be.an.instanceof(Error)
      expect(err).to.have.property('name', 'ValidationError')

      const [ invalid ] = err.details

      expect(invalid).to.have.property('path', 'password')
    })

  })

  const { userData } = users

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

    describe('isPollOwner', () => {

      context('when the user.id matches the poll.user_id', () => {

        it('is true', async () => {

          const userId = 1
          const pollId = 1

          const isOwner = await users.isPollOwner(userId, pollId)

          expect(isOwner).to.be.true
        })

      })

      context('when the user.id mismatches the poll.user_id', () => {

        it('is false', async () => {

          const userId = 2
          const pollId = 1

          const isOwner = await users.isPollOwner(userId, pollId)

          expect(isOwner).to.be.false

        })

      })

    })

    describe('getPolls', () => {

      it('lists all polls for a username', async () => {

        const list = await users.getPolls('foo')

        expect(list).to.have.property('length', 1)
      })

    })

  })


  const { postUser } = users

  describe('postUser', () => {

    let app, client, user, users

    before(() => {

      users = userData()
      user = { id: 1, username: 'foo' }

      const handler = (req, res) => {
        expect(req.user).to.include(user)
        expect(req.user).not.to.have.property('password')
        res.end()
      }
      app = express()
        .get('/', postUser(users), handler)
      client = request(app)
    })

    beforeEach(() => stub(users, 'create'))

    it('sets the new user on req', async () => {

      users.create.resolves(user)

      const res = await client.get('/')

      expect(res).to.have.property('status', 200)
    })

  })


  const { checkPollOwner } = users

  describe('checkPollOwner', () => {

    let app, client, users

    before(() => {

      users = userData()
      const setUser = (req, res, next) => {
        (req.user = { id: 1, username: 'foo' }) && next()
      }
      const handler = (req, res) => res.end()
      app = express()
        .use(setUser)
        .get('/', checkPollOwner(users), handler)
        .use(errorHandler)
      client = request(app)
    })

    beforeEach(() => stub(users, 'isPollOwner'))

    afterEach(() => users.isPollOwner.restore())

    context('when the user is the owner of the poll', () => {

      it('advances to the next middleware', async () => {

        users.isPollOwner.resolves(true)

        const res = await client.get('/')

        expect(res).to.have.property('status', 200)
      })

    })

    context('when the user is not the owner of the poll', () => {

      it('returns an Unauthorized error', async () => {

        users.isPollOwner.resolves(false)

        const res = await client.get('/')

        expect(res).to.have.property('status', 401)
      })

    })

  })


  const { getPollsByUsername } = users

  describe('getPollsByUsername', () => {

    let app, client, users

    before(() => {

      users = userData()
      app = express()
        .get('/:username/polls', getPollsByUsername(users))
      client = request(app)
    })

    beforeEach(() => stub(users, 'getPolls'))

    it('gets all polls for a given username', async () => {

      users.getPolls.resolves([])

      const res = await client.get('/foo/polls')

      expect(res).to.have.property('status', 200)
    })

  })

})
