
import { skipSlow } from '@thebearingedge/test-utils'
import { knex, redis } from '../core'


global.slow = skipSlow()


before(() => knex.seed.run())

after(() => {
  redis.quit()
  knex.destroy()
})
