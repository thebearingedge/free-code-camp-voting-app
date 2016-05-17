
import { begin, expect } from '@thebearingedge/test-utils'
import { knex } from '../core'
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

      expect(poll).to.have.interface({
        id: Number,
        question: String,
        slug: String,
        userId: Number,
        votes: Number
      })
    })
  })

  describe('findById', () => {

    context('when a poll exists', () => {

      it('selects a poll by id', async () => {

        const poll = await polls.findById(1)

        expect(poll).to.have.interface({
          id: Number,
          question: String,
          slug: String,
          userId: Number
        })
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

      expect(saved).to.have.interface({
        id: Number,
        username: String,
        question: String,
        slug: String,
        options: Array
      })

      const [ option ] = saved.options

      expect(option).to.have.interface({
        id: Number,
        pollId: Number,
        value: String,
        votes: Number
      })
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

})
