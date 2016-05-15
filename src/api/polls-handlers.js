
import joi from 'joi'
import wrap from 'express-async-wrap'
import { validate } from './utils'
import { NotFound } from './errors'


export const optionSchema = joi.object().keys({
  value: joi.string().required()
})


export const pollSchema = joi.object().keys({
  question: joi.string().required(),
  options: joi.array().min(1).items(optionSchema).required()
})


export const getPoll = polls => wrap(async ({ params }, res, next) => {

  const { pollId } = params

  const poll = await polls.findById(pollId)

  if (!poll) throw new NotFound(`could not find poll with id '${pollId}'`)

  res.json(poll)
})


export const postPoll = polls => wrap(async (req, res, next) => {

  const { params, body } = req
  const { userId } = params

  const poll = await validate(body, pollSchema)

  const created = await polls.create(userId, poll)

  res.status(201).json(created)
})


export const deletePoll = polls => wrap(async ({ params, user }, res) => {

  const { pollId } = params

  await polls.deleteById(pollId)

  res.sendStatus(204)
})


export const postOption = polls => wrap(async ({ params, body }, res) => {

  const { pollId } = params

  const option = await validate(body, optionSchema)

  const created = await polls.addOption(pollId, option)

  res.status(201).json(created)
})
