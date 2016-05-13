
export const up = async ({ schema }) =>

  schema
    .table('options', tb => {
      tb.integer('poll_id')
        .notNullable()
        .references('id')
        .inTable('polls')
        .onDelete('cascade')
    })


export const down = ({ schema }) =>

  schema
    .table('options', tb => {
      tb.dropColumn('poll_id')
    })
