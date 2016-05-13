
export const up = knex => {

  // const options_view = knex
  //   .select('options.id')
  //   .count('votes.id as votes')
  //   .from('polls')
  //   .innerJoin('options', 'polls.id', 'options.poll_id')
  //   .innerJoin('votes', 'options.id', 'votes.option_id')
  //   .count()

  // return knex.raw(`create or replace view "options_view" as ${options_view}`)

  return null
}


export const down = ({ raw }) => null

  // raw('drop view if exists "options_view" cascade')
