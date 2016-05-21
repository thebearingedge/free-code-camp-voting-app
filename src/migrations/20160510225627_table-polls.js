
export const up = ({ schema }) =>

  schema
    .createTable('polls', tb => {
      tb.increments('id')
        .primary()
      tb.string('question')
        .notNullable()
      tb.string('slug')
        .notNullable()
    })


export const down = ({ raw }) =>

  raw('drop table "polls" cascade')
