
import { stringify } from 'qs'


export const FETCH = 'FETCH'


const toArgs = ({ url = '/', method, headers, params, body } = {}) => {

  if (params) url += '?' + stringify(params)

  return [url, { method, headers, body }]
}


export const reduxFetch = (fetch, handlers) =>

  ({ dispatch }) => next => action => {

    const { type, payload, meta } = action

    if (type !== FETCH) return next(action)

    const { request, success, failure } = meta

    const onRequest = handlers[request]
    const onSuccess = handlers[success]
    const onFailure = handlers[failure]

    onRequest && dispatch(onRequest(payload))

    return fetch(...toArgs(payload))
      .then(res => res.json())
      .then(data => onSuccess && dispatch(onSuccess(data)))
      .catch(err => onFailure && dispatch(onFailure(err)))
  }
