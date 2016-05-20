
import joi from 'joi'
import wrap from 'express-async-wrap'
import { validate, lowerSlug } from './utils'
import { NotFound, BadRequest } from './errors'


export const optionSchema = joi.object().keys({
  value: joi.string().required()
})


export const pollSchema = joi.object().keys({
  question: joi.string().required(),
  options: joi.array().min(1).items(optionSchema).required()
})


export const getPolls = polls => wrap(async (_, res) => {

  const pollsList = await polls.list()

  res.json(pollsList)
})


export const getPoll = polls => wrap(async ({ params }, res, next) => {

  const { pollId } = params

  const poll = await polls.findById(pollId)

  if (!poll) throw new NotFound('poll does not exist')

  res.json(poll)
})


export const postPoll = polls => wrap(async ({ body }, res, next) => {

  const poll = await validate(body, pollSchema)

  const { id: userId } = res.locals.user

  const slug = lowerSlug(body.question)

  const exists = await polls.pollExists(userId, slug)

  if (exists) throw new BadRequest(`duplicate poll ${slug}`)

  const created = await polls.create({ userId, slug, ...poll })

  res.status(201).json(created)
})


export const deletePoll = polls => wrap(async ({ params }, res) => {

  const { pollId } = params

  await polls.deleteById(pollId)

  res.sendStatus(204)
})


export const getPollByUserSlug = polls => wrap(async ({ params }, res) => {

  const { username, slug } = params

  const poll = await polls.findByUserSlug(username, slug)

  if (!poll) throw new NotFound('poll not found')

  res.json(poll)
})
