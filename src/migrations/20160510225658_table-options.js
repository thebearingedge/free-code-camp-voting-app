
export const up = ({ schema }) =>

  schema
    .createTable('options', tb => {
      tb.increments('id')
        .primary()
      tb.string('value')
        .notNullable()
    })


export const down = ({ raw }) =>

  raw('drop table "options" cascade')
