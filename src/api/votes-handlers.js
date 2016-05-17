
import joi from 'joi'
import wrap from 'express-async-wrap'
import { validate } from './utils'
import { BadRequest } from './errors'


export const voteSchema = joi.object().keys({
  optionId: joi.number().integer().required()
})


export const postVote = votes => wrap(async ({ body }, res) => {

  const { optionId } = await validate(body, voteSchema)

  const isValidOption = await votes.optionExists(optionId)

  if (!isValidOption) throw new BadRequest('invalid poll option')

  const vote = await votes.create({ optionId })

  res.status(201).json(vote)
})
