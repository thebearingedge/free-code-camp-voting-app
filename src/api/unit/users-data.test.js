
import { begin, expect } from '@thebearingedge/test-utils'
import { knex } from '../core'
import { Profile } from '../fixtures/interfaces'
import { usersData } from '../users-data'


describe('users-data', () => {

  let trx, users

  beforeEach(begin(knex, _trx => {
    trx = _trx
    users = usersData(trx)
  }))

  afterEach(() => trx.rollback())

  describe('nameExists', () => {

    it('confirms the existence of a user', async () => {

      const exists = await users.nameExists('foo')

      expect(exists).to.be.true
    })

  })

  describe('findByUsername', () => {

    context('when a user exits', () => {

      it('returns the user', async () => {

        const user = await users.findByUsername('foo')

        expect(user).to.have.interface(Profile)
      })

    })

    context('when a user does not exits', () => {

      it('returns null', async () => {

        const user = await users.findByUsername('xyzzy')

        expect(user).to.be.null
      })

    })

  })

  describe('findWithHash', () => {

    context('when a user exists', () => {

      it('returns the user', async () => {

        const user = await users.findWithHash('foo')

        expect(user).to.have.interface({
          id: Number,
          hash: String
        })
      })

    })

    context('when a user does not exist', () => {

      it('returns null', async () => {

        const user = await users.findWithHash('bar')

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
      expect(user).to.have.interface({
        id: Number,
        username: String
      })
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
