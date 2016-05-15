
export const up = knex => {

  const pollsView = knex
    .select('p.id', 'u.username', 'p.user_id', 'p.question', 'p.slug')
    .sum('o.votes as votes')
    .from('users as u')
    .innerJoin('polls as p', 'u.id', 'p.user_id')
    .groupBy('u.username')
    .innerJoin('options_view as o', 'p.id', 'o.poll_id')
    .groupBy('p.id')

  return knex.raw(`create or replace view "polls_view" as ${pollsView}`)
}


export const down = ({ raw }) =>

  raw('drop view if exists "polls_view" cascade')
