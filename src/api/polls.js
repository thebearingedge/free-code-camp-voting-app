
import joi from 'joi'
import wrap from 'express-async-wrap'


export const pollSchema = joi.object()


export const createPoll = knex => wrap(async (req, res, next) => {


})
