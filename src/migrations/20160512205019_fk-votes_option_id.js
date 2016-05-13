
export const up = async ({ schema }) =>

  schema
    .table('votes', tb => {
      tb.integer('option_id')
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('cascade')
    })


export const down = ({ schema }) =>

  schema
    .table('votes', tb => {
      tb.dropColumn('option_id')
    })
