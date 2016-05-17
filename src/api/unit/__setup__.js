
import { knex, redis } from '../core'

before(() => knex.seed.run())

after(() => {
  redis.quit()
  knex.destroy()
})
