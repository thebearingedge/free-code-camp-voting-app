
export const up = ({ schema }) =>

  schema
    .createTable('polls', tb => {
      tb.increments('id')
      tb.string('name')
        .notNullable()
    })


export const down = ({ raw }) =>

  raw('drop table if exists "polls" cascade')
