
import joi from 'joi'
import wrap from 'express-async-wrap'
import { validate } from './utils'
import { BadRequest } from './errors'


export const voteSchema = joi.object().keys({
  optionId: joi.number().integer().required()
})


export const postVote = options => wrap(async ({ body }, res) => {

  const { optionId } = await validate(body, voteSchema)

  const exists = await options.optionExists(optionId)

  if (!exists) throw new BadRequest('invalid poll option')

  const vote = await options.addVote({ optionId })

  res.status(201).json(vote)
})
