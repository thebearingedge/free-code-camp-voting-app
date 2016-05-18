
import wrap from 'express-async-wrap'
import { NotFound } from './errors'


export const getUserByName = users => wrap(async ({ params }, res) => {

  const { username } = params

  const user = await users.findByUsername(username)

  if (!user) throw new NotFound('profile not found')

  res.json(user)
})
