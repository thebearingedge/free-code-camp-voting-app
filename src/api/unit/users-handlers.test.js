
import { expect, request, stub } from '@thebearingedge/test-utils'
import express from 'express'
import { errorHandler } from '../errors'
import { usersData } from '../users-data'
import { getUserByName } from '../users-handlers'


describe('users-handlers', () => {

  let users, client

  before(() => {

    users = usersData()

    const app = express()
      .get('/api/users/:username', getUserByName(users))
      .use(errorHandler)

    client = request(app)
  })

  beforeEach(() => stub(users, 'findByUsername'))

  afterEach(() => users.findByUsername.restore())

  describe('getUserByName', () => {

    context('when the user exists', () => {

      it('sends the user', async () => {

        users.findByUsername.resolves({ id: 1, username: 'foo' })

        await client
          .get('/api/users/foo')
          .expect(200)
      })

    })

    context('when the user does not exist', () => {

      it('sends a Not Found Error', async () => {

        users.findByUsername.resolves(null)

        const { body } = await client
          .get('/api/users/foo')
          .expect(404)

        expect(body).to.have.property('error', 'Not Found')
      })
    })

  })

})
