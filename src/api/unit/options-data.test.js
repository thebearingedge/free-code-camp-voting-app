
import { begin, expect, rejected } from '@thebearingedge/test-utils'
import { knex } from '../core'
import { Option, Vote } from '../fixtures/interfaces'
import { optionsData } from '../options-data'


describe('options-data', () => {

  let trx, options

  beforeEach(begin(knex, _trx => {
    trx = _trx
    options = optionsData(trx)
  }))

  afterEach(() => trx.rollback())

  describe('findById', () => {

    context('when an option does not exist', () => {

      it('returns null', async () => {

        const option = await options.findById(5)

        expect(option).to.be.null
      })

    })

    context('when an option exists', () => {

      it('returns the option', async () => {

        const option = await options.findById(3)

        expect(option).to.have.interface(Option)
      })

    })

  })

  describe('create', () => {

    context('when the option does not exist', () => {

      it('inserts the option', async () => {

        const data = { pollId: 1, value: 'yellow' }

        const option = await options.create(data)

        expect(option).to.have.interface(Option)
      })

    })

    context('when the option already exists', () => {

      it('does not insert the option', async () => {

        const data = { pollId: 1, value: 'red' }

        const err = await rejected(options.create(data))

        expect(err.message).to.include('duplicate')
      })

    })

  })

  describe('valueExists', () => {

    context('when an option exists', () => {

      it('returns true', async () => {

        const pollId = 1
        const value = 'red'

        const exists = await options.valueExists(pollId, value)

        expect(exists).to.be.true
      })

    })

    context('when an option does not exist', () => {

      it('returns false', async () => {

        const pollId = 1
        const value = 'yellow'

        const exists = await options.valueExists(pollId, value)

        expect(exists).to.be.false
      })

    })

  })

  describe('optionExists', () => {

    context('when an option exists', () => {

      it('returns true', async () => {

        const exists = await options.optionExists(1)

        expect(exists).to.be.true
      })

    })

    context('when an option does not exist', () => {

      it('returns false', async () => {

        const exists = await options.optionExists(1000)

        expect(exists).to.be.false
      })

    })

  })

  describe('addVote', () => {

    it('registers a vote with an option', async () => {

      const vote = await options.addVote({ optionId: 1 })

      expect(vote).to.have.interface(Vote)
    })

  })

})
