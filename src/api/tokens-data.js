
import { tokenExpiry } from '../config'


export const tokensData = redis => ({

  get: token => redis.getAsync(token),


  set: token => redis.setexAsync(token, tokenExpiry, token),


  unset: token => redis.delAsync(token)

})
