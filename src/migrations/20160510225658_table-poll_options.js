
export const up = ({ schema }) =>

  schema
    .createTable('poll_options', tb => {
      tb.increments('id')
      tb.string('value')
        .notNullable()
    })


export const down = ({ raw }) =>

  raw('drop table if exists "poll_options" cascade')
