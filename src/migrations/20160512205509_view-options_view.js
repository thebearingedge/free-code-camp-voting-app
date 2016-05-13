
export const up = knex => {

  const optionsView = knex
    .select('o.id', 'o.value', 'o.poll_id')
    .count('votes.id as votes')
    .from('polls as p')
    .innerJoin('options as o', 'p.id', 'o.poll_id')
    .leftJoin('votes', 'o.id', 'votes.option_id')
    .groupBy('o.id')

  return knex.raw(`create or replace view "options_view" as ${optionsView}`)
}


export const down = ({ raw }) =>

  raw('drop view if exists "options_view" cascade')
