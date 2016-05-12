
import { expect, rejected } from '@thebearingedge/test-utils'
import { validateUser } from '../src/api/users'

describe('users middleware', () => {

  describe('validateUser', () => {

    it('requires a string username', async () => {

      const user = { password: 'bar' }

      const err = await rejected(validateUser(user))

      expect(err).to.have.property('name', 'ValidationError')
    })

    it('requires a string username', async () => {

      const user = { username: 'foo' }

      const err = await rejected(validateUser(user))

      expect(err).to.have.property('name', 'ValidationError')
    })

  })

})
