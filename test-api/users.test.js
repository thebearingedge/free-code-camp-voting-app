
import { expect, rejected } from '@thebearingedge/test-utils'
import { newUserSchema } from '../src/api/users'
import { validate } from '../src/api/utils'

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

})
