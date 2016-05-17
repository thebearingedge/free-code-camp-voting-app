
import wrap from 'express-async-wrap'
import { validate } from './utils'
import { optionSchema } from './polls-handlers'


export const postOption = options => wrap(async ({ body, params }, res) => {

  const option = await validate(body, optionSchema)

  const { pollId } = params

  const saved = await options.create({ pollId, ...option })

  res.status(201).json(saved)
})
