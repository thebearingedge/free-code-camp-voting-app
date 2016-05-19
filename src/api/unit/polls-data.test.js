
import { begin, expect } from '@thebearingedge/test-utils'
import { knex } from '../core'
import { PollListItem, Poll, Option } from '../fixtures/interfaces'
import { pollsData } from '../polls-data'


describe('polls-data', () => {

  let trx, polls

  beforeEach(begin(knex, _trx => {
    trx = _trx
    polls = pollsData(trx)
  }))

  afterEach(() => trx.rollback())

  describe('list', () => {

    it('selects the list of polls', async () => {

      const [ poll ] = await polls.list()

      expect(poll).to.have.interface(PollListItem)
    })
  })

  describe('findById', () => {

    context('when a poll exists', () => {

      it('selects a poll by id', async () => {

        const poll = await polls.findById(1)

        expect(poll).to.have.interface(Poll)
      })

    })

    context('when a poll does not exist', () => {

      it('returns null', async () => {

        const poll = await polls.findById(2)

        expect(poll).to.be.null
      })

    })

  })

  describe('create', () => {

    it('inserts a poll and its options for a username', async () => {

      const poll = {
        userId: 1,
        question: 'What is your favorite dog?',
        options: [{ value: 'Basenji' }, { value: 'Pom-Chi'}]
      }

      const saved = await polls.create(poll)

      expect(saved).to.have.interface(Poll)

      const [ option ] = saved.options

      expect(option).to.have.interface(Option)
    })

  })

  describe('deleteById', () => {

    it('deletes a poll', async () => {

      const id = 1

      await polls.deleteById(id)

      const deleted = await trx
        .from('polls')
        .where({ id })
        .first()

      expect(deleted).not.to.exist
    })

  })

  describe('findByUserSlug', () => {

    context('when the poll exists', () => {

      it('returns the poll', async () => {

        const poll = await polls
          .findByUserSlug('foo', 'what-is-your-favorite-color')

        expect(poll).to.have.interface(Poll)
      })

    })

  })

  context('when the poll does not exist', () => {

    it('returns null', async () => {

      const poll = await polls.findByUserSlug('qux', 'how-do')

      expect(poll).to.be.null
    })

  })

})
