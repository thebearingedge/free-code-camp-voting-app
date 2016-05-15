
import { begin, expect } from '@thebearingedge/test-utils'
import { knex } from '../core'
import { usersData } from '../users-data'

describe('users-data', () => {

  let trx, users

  beforeEach(begin(knex, _trx => {
    trx = _trx
    users = usersData(trx)
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

})
