
export const VOTE_SUCCEEDED = 'VOTE_SUCCEEDED'

export const voteSucceeded = ({ optionIndex, vote }) => ({
  type: VOTE_SUCCEEDED,
  payload: { optionIndex, vote }
})


export const POLL_LOADED = 'POLL_LOADED'

export const pollLoaded = poll => ({
  type: POLL_LOADED,
  payload: poll
})


export const POLLS_LOADED = 'POLLS_LOADED'

export const pollsLoaded = polls => ({
  type: POLLS_LOADED,
  payload: polls
})


export const LOGIN_SUCCEEDED = 'LOGIN_SUCCEEDED'

export const loginSucceeded = user => ({
  type: LOGIN_SUCCEEDED,
  payload: user
})


export const PROFILE_LOADED = 'PROFILE_LOADED'

export const profileLoaded = profile => ({
  type: PROFILE_LOADED,
  payload: profile
})


export const LOGOUT_SUCCEEDED = 'LOGOUT_SUCCEEDED'

export const logoutSucceeded = _ => ({
  type: LOGOUT_SUCCEEDED
})


export const QUESTION_UPDATED = 'QUESTION_UPDATED'

export const questionUpdated = question => ({
  type: QUESTION_UPDATED,
  payload: question
})


export const OPTION_ADDED = 'OPTION_ADDED'

export const optionAdded = option => ({
  type: OPTION_ADDED,
  payload: option
})


export const OPTION_UPDATED = 'OPTION_UPDATED'

export const optionUpdated = adding => ({
  type: OPTION_UPDATED,
  payload: adding
})


export const POLL_FORM_CLEARED = 'POLL_FORM_CLEARED'

export const pollFormCleared = _ => ({
  type: POLL_FORM_CLEARED
})


export const POLL_FORM_LOADED = 'POLL_FORM_LOADED'

export const pollFormLoaded = poll => ({
  type: POLL_FORM_LOADED,
  payload: poll
})
