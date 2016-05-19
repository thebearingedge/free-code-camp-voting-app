
import { begin, expect, rejected } from '@thebearingedge/test-utils'
import { knex } from '../core'
import { Option } from '../fixtures/interfaces'
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

    context('when the option does not exist', () => {

      it('inserts the option', async () => {

        const data = { pollId: 1, value: 'yellow' }

        const option = await options.create(data)

        expect(option).to.have.interface(Option)
      })

    })

    context('when the option already exists', () => {

      it('is not inserted', async () => {

        const data = { pollId: 1, value: 'red' }

        const err = await rejected(options.create(data))

        expect(err.message).to.include('duplicate')
      })

    })

  })

})
