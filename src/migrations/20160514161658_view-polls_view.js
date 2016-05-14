
export const up = knex => {

  const pollsView = knex
    .select('p.id', 'u.username as user', 'p.question', 'p.slug')
    .from('polls as p')
    .innerJoin('users as u', 'p.user_id', 'u.id')

  return knex.raw(`create or replace view "polls_view" as ${pollsView}`)
}


export const down = ({ raw }) =>

  raw('drop view if exists "polls_view" cascade')
