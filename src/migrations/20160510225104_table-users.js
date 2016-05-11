
export const up = ({ schema }) =>

  schema
    .createTable('users', tb => {
      tb.increments('id')
      tb.string('username')
        .unique()
        .notNullable()
    })


export const down = ({ raw }) =>

  raw('drop table if exists "users" cascade')
