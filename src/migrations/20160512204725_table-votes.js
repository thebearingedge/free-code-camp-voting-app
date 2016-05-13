
export const up = ({ schema, raw }) =>

  schema
    .createTable('votes', tb => {
      tb.increments('id')
      tb.timestamp('time')
        .notNullable()
        .defaultTo(raw('now()'))
    })


export const down = ({ raw }) =>

  raw('drop table if exists "votes" cascade')
