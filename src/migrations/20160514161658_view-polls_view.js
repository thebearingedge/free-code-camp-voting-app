
export const up = knex => {

  const votes = knex.raw('sum(o.votes)::int as votes')

  const pollsView = knex
    .select('p.id', 'u.username', 'p.user_id', 'p.question', 'p.slug', votes)
    .from('users as u')
    .innerJoin('polls as p', 'u.id', 'p.user_id')
    .groupBy('u.username')
    .innerJoin('options_view as o', 'p.id', 'o.poll_id')
    .groupBy('p.id')

  return knex.raw(`create or replace view "polls_view" as ${pollsView}`)
}


export const down = ({ raw }) =>

  raw('drop view "polls_view" cascade')
