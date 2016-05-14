
import { knex, redis } from '../src/api/core'

after(() => {
  redis.quit()
  knex.destroy()
})
