
import React from 'react'
import { connect } from 'react-redux'
import { asyncConnect } from 'redux-connect'


export const VOTE_SUCCESS = 'VOTE_SUCCESS'
export const POLL_LOADED = 'POLL_LOADED'


export const Poll = ({ poll, dispatch }) =>
  <div>
    <p>{ poll.question }</p>
    <ul>
      { poll.options.map(({ id, pollId, value, votes }, index) =>
          <li key={ id }>
            <button onClick={ handleVote(dispatch, index, id) }>
              { value } { votes }
            </button>
          </li>
        ) }
    </ul>
  </div>


export const handleVote = (dispatch, optionIndex, optionId) => _ =>

  dispatch((_, getState, { fetch, localStorage }) =>

    fetch('/api/vote', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ optionId })
    })
    .then(res => res.json())
    .then(onVoteSuccess(dispatch, optionIndex))
    .then(persistVotes(localStorage, getState))
  )


export const onVoteSuccess = (dispatch, optionIndex) => vote =>

  dispatch({
    type: VOTE_SUCCESS,
    payload: { optionIndex, vote }
  })


export const onPollLoaded = dispatch => poll => {

  dispatch({ type: POLL_LOADED, payload: poll })

  return poll
}


export const persistVotes = (localStorage, getState) => _ =>

  localStorage.setItem('votes', JSON.stringify(getState().votes))


const asyncState = [
  {
    key: 'poll',
    promise({ helpers, store, params }) {

      const { fetch } = helpers
      const { dispatch } = store
      const { username, slug } = params

      return fetch(`/api/user/${username}/${slug}`)
        .then(res => res.json())
        .then(onPollLoaded(dispatch))
    }
  }
]


const mapState = ({ poll }, props) => ({ ...props, poll })


export default asyncConnect(asyncState)(connect(mapState)(Poll))
