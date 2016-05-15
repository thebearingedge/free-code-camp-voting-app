
import { knex, redis } from '../core'

after(() => {
  redis.quit()
  knex.destroy()
})
