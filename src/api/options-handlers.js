
import wrap from 'express-async-wrap'
import { validate } from './utils'
import { optionSchema } from './polls-handlers'
import { BadRequest } from './errors'


export const postOption = options => wrap(async ({ body, params }, res) => {

  const { value } = await validate(body, optionSchema)

  const { pollId } = params

  const exists = await options.valueExists(pollId, value)

  if (exists) throw new BadRequest('option already exists')

  const saved = await options.create({ pollId, value })

  res.status(201).json(saved)
})
