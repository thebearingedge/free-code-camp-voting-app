
import { POLL_LOADED, POLLS_LOADED, PROFILE_LOADED,
         VOTE_SUCCEEDED, LOGIN_SUCCEEDED, LOGOUT_SUCCEEDED,
         QUESTION_UPDATED, OPTION_ADDED, OPTION_UPDATED,
         POLL_FORM_CLEARED, POLL_FORM_LOADED } from './actions'


export const poll = (state = { options: [] }, { type, payload }) => {

  if (type === POLL_LOADED) return payload

  if (type !== VOTE_SUCCEEDED) return state

  const { optionIndex: index, vote } = payload

  if (vote.pollId !== state.id) return state

  const { options } = state
  const option = options[index]

  const upVoted = { ...option, votes: option.votes + 1 }

  return {
    ...state,
    votes: state.votes + 1,
    options: [...options.slice(0, index), upVoted, ...options.slice(index + 1)]
  }
}


export const polls = (state = [], { type, payload }) =>

  type === POLLS_LOADED ? payload : state


export const votes = (state = {}, { type, payload }) =>

  type === VOTE_SUCCEEDED
    ? { ...state, [payload.vote.pollId]: payload.vote }
    : state


export const user = (state = {}, { type, payload }) => {

  switch (type) {
    case LOGIN_SUCCEEDED: return payload
    case LOGOUT_SUCCEEDED: return {}
    default:
      return state
  }
}


export const profile = (state = {}, { type, payload }) =>

  type === PROFILE_LOADED
    ? payload
    : state


export const pollForm = (state = { question: '', adding: '', options: [] }, action) => {

  const { type, payload } = action

  switch (type) {
    case QUESTION_UPDATED:
      return { ...state, question: payload }
    case OPTION_ADDED:
      return { ...state, adding: '', options: state.options.concat(payload) }
    case OPTION_UPDATED:
      return { ...state, adding: payload }
    case POLL_FORM_CLEARED:
      return { question: '', adding: '', options: [] }
    case POLL_FORM_LOADED:
      return { ...payload, adding: '' }
    default:
      return state
  }
}
