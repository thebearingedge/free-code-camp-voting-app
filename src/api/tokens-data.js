
import { tokenExpiry } from '../config'


export const tokensData = redis => ({

  async save(token) {

    return redis.setexAsync(token, tokenExpiry, token)
  },

  async get(token) {

    return redis.getAsync(token)
  }

})
