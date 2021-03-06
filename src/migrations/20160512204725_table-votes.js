
export const up = ({ schema, raw }) =>

  schema
    .createTable('votes', tb => {
      tb.increments('id')
        .primary()
      tb.timestamp('date')
        .notNullable()
        .defaultTo(raw('now()'))
    })


export const down = ({ raw }) =>

  raw('drop table "votes" cascade')
