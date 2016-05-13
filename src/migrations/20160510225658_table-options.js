
export const up = ({ schema }) =>

  schema
    .createTable('options', tb => {
      tb.increments('id')
      tb.string('value')
        .notNullable()
    })


export const down = ({ raw }) =>

  raw('drop table if exists "options" cascade')
