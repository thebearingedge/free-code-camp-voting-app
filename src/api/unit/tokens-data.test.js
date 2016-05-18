
import { expect, spy } from '@thebearingedge/test-utils'
import { redis } from '../core'
import { tokenExpiry } from '../../config'
import { tokensData } from '../tokens-data'


const mockToken = 'foo-bar-baz'


describe('tokens-data', () => {

  let tokens

  before(() => (tokens = tokensData(redis)))

  describe('save', () => {

    beforeEach(async () => {

      await redis.flushdb()

      spy(redis, 'setexAsync')
    })

    afterEach(() => redis.setexAsync.restore())

    it('stores a token with the appropriate expiration', async () => {

      await tokens.set(mockToken)

      expect(redis.setexAsync)
        .to.have.been.calledWithExactly(mockToken, tokenExpiry, mockToken)

      const retrieved = await redis.getAsync(mockToken)

      expect(retrieved).to.be.ok
      expect(retrieved).to.equal(mockToken)
    })

  })

  describe('get', () => {

    beforeEach(async () => redis.setAsync(mockToken, mockToken))

    context('when a token exists', () => {

      it('returns the token', async () => {

        const found = await tokens.get(mockToken)

        expect(found).to.be.ok
        expect(found).to.equal(mockToken)
      })

    })

    context('when a token does not exist', () => {

      it('returns null', async () => {

        const found = await tokens.get('bar-baz-qux')

        expect(found).to.be.null
      })

    })

  })

  describe('unset', () => {

    it('deletes a token', async () => {

      const token = 'foo-bar-baz'

      await redis.setAsync(token, token)

      await tokens.unset(token)

      const found = await redis.getAsync(token)

      expect(found).to.be.null
    })
  })

})
