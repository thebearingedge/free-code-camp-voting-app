
export const up = ({ schema }) =>

  schema
    .createTable('users', tb => {
      tb.increments('id')
      tb.string('username')
        .unique()
        .notNullable()
      tb.string('password')
        .notNullable()
    })


export const down = ({ raw }) =>

  raw('drop table "users" cascade')
