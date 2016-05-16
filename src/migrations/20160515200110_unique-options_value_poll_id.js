
export const up = ({ schema }) =>

  schema
    .table('options', tb => {
      tb.unique(['value', 'poll_id'])
    })


export const down = ({ schema }) =>

  schema
    .table('options', tb => {
      tb.dropUnique(['value', 'poll_id'])
    })
