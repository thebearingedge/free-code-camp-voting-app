
import wrap from 'express-async-wrap'
import { validate } from './utils'
import { optionSchema } from './polls-handlers'


export const postOption = options => wrap(async ({ body }, res) => {

  const option = await validate(body, optionSchema)

  const saved = await options.create(option)

  res.status(201).json(saved)
})
