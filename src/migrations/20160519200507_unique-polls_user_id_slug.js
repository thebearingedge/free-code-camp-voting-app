
export const up = ({ schema }) =>

  schema
    .table('polls', tb => {
      tb.unique(['user_id', 'slug'])
    })


export const down = ({ schema }) =>

  schema
    .table('polls', tb => {
      tb.dropUnique(['user_id', 'slug'])
    })
