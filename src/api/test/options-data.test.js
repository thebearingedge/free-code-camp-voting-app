
import { begin, expect } from '@thebearingedge/test-utils'
import { knex } from '../core'
import { optionsData } from '../options-data'

describe('options-data', () => {

  let trx, options

  beforeEach(begin(knex, _trx => {
    trx = _trx
    options = optionsData(trx)
  }))

  describe('create', () => {

    it('inserts an option')

  })

})
