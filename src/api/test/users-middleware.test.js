
import { expect, stub, request } from '@thebearingedge/test-utils'
import { omit } from 'lodash'
import express from 'express'
import { json } from 'body-parser'
import { hash } from 'bcrypt-as-promised'
import { usersData } from '../users-data'
import { errorHandler } from '../errors'
import { postUser, login, checkPollOwner } from '../users-middleware'


const password = 'bar'
const mockUser = { username: 'foo', password }


describe('users-middleware', () => {

  let users, app, client, hashed

  before(async () => {

    users = usersData()

    hashed = await hash(password)

    const postUserHandler = ({ user }, res) => {

      expect(user).to.have.interface({ id: Number, username: String })
      expect(user).not.to.have.property('password')

      res.status(201).end()
    }

    const setUser = (req, res, next) =>

      (req.user = omit(mockUser, 'password')) && next()

    const deleteHandler = (_, res) => res.sendStatus(204)

    const loginHandler = (_, res) => res.sendStatus(204)

    app = express()
      .use(json())
      .post('/signup', postUser(users), postUserHandler)
      .post('/login', login(users), loginHandler)
      .delete('/polls/:pollId', setUser, checkPollOwner(users), deleteHandler)
      .use(errorHandler)

    client = request(app)
  })

  describe('postUser', () => {

    beforeEach(() => stub(users, 'create'))

    afterEach(() => users.create.restore())

    it('sets the new user on req', async () => {

      users.create.resolves({ id: 1, ...mockUser })

      const res = await client
        .post('/signup')
        .send(mockUser)

      expect(res).to.have.property('status', 201)
    })

  })

  describe('login', () => {

    beforeEach(() => stub(users, 'findByUsername'))

    afterEach(() => users.findByUsername.restore())

    context('when the username is not found', () => {

      it('returns a Forbidden error', async () => {

        users.findByUsername.resolves(null)

        const res = await client
          .post('/login')
          .send(mockUser)

        expect(res).to.have.property('status', 403)
        expect(res.body).to.have.property('error', 'Forbidden')
      })

    })

    context('when the password does not match', () => {

      it('returns a Forbidden error', async () => {

        users.findByUsername.resolves({ ...mockUser, password: hashed })

        const res = await client
          .post('/login')
          .send({ ...mockUser, password: 'baz' })

        expect(res).to.have.property('status', 403)
        expect(res.body).to.have.property('error', 'Forbidden')
      })

    })

    context('when the username and password match', () => {

      it('is successfull', async () => {

        users.findByUsername.resolves({ ...mockUser, password: hashed })

        const res = await client
          .post('/login')
          .send(mockUser)

        expect(res).to.have.property('status', 204)
      })

    })

  })

  describe('checkPollOwner', () => {

    beforeEach(() => stub(users, 'isPollOwner'))

    afterEach(() => users.isPollOwner.restore())

    context('when the user is the owner of the poll', () => {

      it('advances to the next middleware', async () => {

        users.isPollOwner.resolves(true)

        const res = await client.delete('/polls/1')

        expect(res).to.have.property('status', 204)
      })

    })

    context('when the user is not the owner of the poll', () => {

      it('returns an Unauthorized error', async () => {

        users.isPollOwner.resolves(false)

        const res = await client.delete('/polls/1')

        expect(res).to.have.property('status', 403)
      })

    })

  })

})
