
import { begin, expect } from '@thebearingedge/test-utils'
import { knex } from '../core'
import { votesData } from '../votes-data'


describe('votes-data', () => {

  let trx, votes

  beforeEach(begin(knex, _trx => {
    trx = _trx
    votes = votesData(trx)
  }))

  afterEach(() => trx.rollback())

  describe('create', () => {

    it('creates a vote', async () => {

      const vote = await votes.create({ optionId: 1 })

      expect(vote).to.have.interface({
        id: Number,
        optionId: Number,
        date: String
      })
    })

  })

  describe('optionExists', () => {

    context('when the option exists', () => {

      it('is true', async () => {

        const exists = await votes.optionExists(1)

        expect(exists).to.be.true
      })

    })

    context('when the option does not exists', () => {

      it('is false', async () => {

        const exists = await votes.optionExists(1000)

        expect(exists).to.be.false
      })

    })

  })

})
