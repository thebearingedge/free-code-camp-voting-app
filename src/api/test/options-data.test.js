
import { begin, expect, rejected } from '@thebearingedge/test-utils'
import { knex } from '../core'
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

  })

  describe('create', () => {

    context('when an option does not exist', () => {

      it('inserts an option', async () => {

        const option = await options.create({ pollId: 1, value: 'yellow' })

        expect(option).to.have.interface({
          id: Number,
          pollId: Number,
          value: String,
          votes: Number
        })
      })

    })

    context('when an option already exists', () => {

      it('is not inserted', async () => {

        const err = await rejected(options.create({ pollId: 1, value: 'red' }))

        expect(err.message).to.include('duplicate')
      })

    })

  })

})
