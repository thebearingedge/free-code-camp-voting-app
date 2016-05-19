
import joi from 'joi'
import { expect, rejected } from '@thebearingedge/test-utils'
import { validate } from '../utils'
import { ValidationError } from '../errors'


const userSchema = joi.object().keys({
  username: joi.string().token().required(),
  password: joi.string().required()
})


describe('utils', () => {

  describe('validate', () => {

    context('when data is valid', () => {

      it('resolves the data', async () => {

        const data = { username: 'foo', password: 'bar' }

        const user = await validate(data, userSchema)

        expect(user).to.deep.equal(data)
      })

    })

    context('when data is invalid', () => {

      it('rejects with a ValidationError', async () => {

        const data = { username: 'foo' }
        const message = 'invalid user'

        const err = await rejected(validate(data, userSchema, message))

        expect(err).to.be.an.instanceOf(ValidationError)
        expect(err).to.have.property('message', message)
        expect(err)
          .to.have.property('details')
          .that.is.an.instanceOf(Array)
        expect(err.details[0].message)
          .to.include('password')
          .and.to.include('required')
      })
    })
  })

})
