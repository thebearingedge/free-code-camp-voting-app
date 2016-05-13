
export const up = ({ schema }) =>

  schema
    .table('polls', tb => {
      tb.integer('user_id')
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('cascade')
    })


export const down = ({ schema }) =>

  schema
    .table('polls', tb => {
      tb.dropColumn('user_id')
    })
