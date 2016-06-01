
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
