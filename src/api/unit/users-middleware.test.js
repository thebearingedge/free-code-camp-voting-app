
import { expect, stub, request, skipSlow } from '@thebearingedge/test-utils'
import { omit } from 'lodash'
import express from 'express'
import { json } from 'body-parser'
import { hash } from 'bcrypt-as-promised'
import { usersData } from '../users-data'
import { errorHandler } from '../errors'
import { postUser, authenticate, checkPollOwner } from '../users-middleware'


const slow = skipSlow()

const password = 'bar'
const mockUser = { username: 'foo', password }


describe('users-middleware', () => {

  let users, app, client, hashed

  before(async () => {

    users = usersData()

    hashed = await hash(password)

    const setUser = (_, res, next) =>

      (res.locals.user = omit(mockUser, 'password')) && next()

    const deleteHandler = (_, res) => res.sendStatus(204)

    const loginHandler = (_, res) => res.sendStatus(201)

    app = express()
      .use(json())
      .post('/api/signup', postUser(users))
      .post('/api/authenticate', authenticate(users), loginHandler)
      .delete('/api/polls/:pollId', setUser, checkPollOwner(users), deleteHandler)
      .use(errorHandler)

    client = request(app)
  })

  describe('postUser', () => {

    beforeEach(() => {
      stub(users, 'nameExists')
      stub(users, 'findWithHash')
      stub(users, 'create')
    })

    afterEach(() => {
      users.nameExists.restore()
      users.findWithHash.restore()
      users.create.restore()
    })

    context('when the username is not taken', () => {

      it('sets the new user on locals', async () => {

        users.nameExists.resolves(false)
        users.findWithHash.resolves({ ...mockUser, hash: hashed })
        users.create.resolves(omit(mockUser, 'password'))

        await client
          .post('/api/signup')
          .send(mockUser)
          .redirects(1)
          .expect(201)
      })

    })

    context('when the username is taken', () => {

      it('returns a Bad Request error', async () => {

        users.nameExists.resolves(true)

        await client
          .post('/api/signup')
          .send(mockUser)
          .expect(400)
      })

    })

  })

  describe('authenticate', () => {

    beforeEach(() => stub(users, 'findWithHash'))

    afterEach(() => users.findWithHash.restore())

    context('when the username is not found', () => {

      it('returns a Forbidden error', async () => {

        users.findWithHash.resolves(null)

        const res = await client
          .post('/api/authenticate')
          .send(mockUser)
          .expect(403)

        expect(res.body).to.have.property('error', 'Forbidden')
      })

    })

    context('when the password does not match', () => {

      slow('returns a Forbidden error', async () => {

        users.findWithHash.resolves({ ...mockUser, hash: hashed })

        const res = await client
          .post('/api/authenticate')
          .send({ ...mockUser, password: 'baz' })
          .expect(403)

        expect(res.body).to.have.property('error', 'Forbidden')
      })

    })

    context('when the username and password match', () => {

      slow('advances to the login handler', async () => {

        users.findWithHash.resolves({ ...mockUser, hash: hashed })

        await client
          .post('/api/authenticate')
          .send(mockUser)
          .expect(201)
      })

    })

  })

  describe('checkPollOwner', () => {

    beforeEach(() => stub(users, 'isPollOwner'))

    afterEach(() => users.isPollOwner.restore())

    context('when the user is the owner of the poll', () => {

      it('advances to the next middleware', async () => {

        users.isPollOwner.resolves(true)

        await client
          .delete('/api/polls/1')
          .expect(204)
      })

    })

    context('when the user is not the owner of the poll', () => {

      it('returns an Unauthorized error', async () => {

        users.isPollOwner.resolves(false)

        await client
          .delete('/api/polls/1')
          .expect(403)
      })

    })

  })

})
