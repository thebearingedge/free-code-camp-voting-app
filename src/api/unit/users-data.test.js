
import { begin, expect, skipSlow } from '@thebearingedge/test-utils'
import { knex } from '../core'
import { usersData } from '../users-data'


const slow = skipSlow()


describe('users-data', () => {

  let trx, users

  beforeEach(begin(knex, _trx => {
    trx = _trx
    users = usersData(trx)
  }))

  afterEach(() => trx.rollback())

  describe('findByUsername', () => {

    context('when a user exists', () => {

      it('returns the user', async () => {

        const user = await users.findByUsername('foo')

        expect(user).to.be.ok
      })

    })

    context('when a user does not exist', () => {

      it('returns null', async () => {

        const user = await users.findByUsername('bar')

        expect(user).to.be.null

      })

    })

  })

  describe('create', () => {

    slow('saves a new user', async () => {

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

})
