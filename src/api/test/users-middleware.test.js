
import { expect, stub } from '@thebearingedge/test-utils'
import { omit } from 'lodash'
import request from 'supertest-as-promised'
import express from 'express'
import { usersData } from '../users-data'
import { errorHandler } from '../errors'
import { postUser, checkPollOwner } from '../users-middleware'


const mockUser = { username: 'foo', password: 'bar' }


describe('users-middleware', () => {

  let users, app, client

  before(() => {

    users = usersData()

    const postUserHandler = ({ user }, res) => {

      expect(user).to.have.interface({ id: Number, username: String })
      expect(user).not.to.have.property('password')

      res.status(201).end()
    }

    const setUser = (req, res, next) =>

      (req.user = omit(mockUser, 'password')) && next()

    const deletePollHandler = (_, res) => res.sendStatus(204)

    app = express()
      .post('/signup', postUser(users), postUserHandler)
      .delete('/polls/:pollId', setUser, checkPollOwner(users), deletePollHandler)
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
