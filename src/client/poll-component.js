
import React from 'react'
import { connect } from 'react-redux'
import { asyncConnect } from 'redux-connect'

import { pollLoaded, voteSucceeded } from './actions'


export const Poll = ({ poll, votes, dispatch }) =>

  <div>
    <p>{ poll.question }</p>
    <ul>
      { poll.options.map((option, index) =>
          <li key={ option.id }>
            <button onClick={ castVote(dispatch, index, option, votes) }>
              { option.value } { option.votes }
            </button>
          </li>
        ) }
    </ul>
  </div>


export const castVote = (dispatch, optionIndex, option, votes) => _ =>

  dispatch((_, getState, { fetch, localStorage }) => {

    const { id: optionId, pollId } = option

    if (votes[pollId]) return Promise.resolve()

    return fetch('/api/vote', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ optionId })
    })
    .then(res => res.json())
    .then(onVoteSucceeded(dispatch, optionIndex))
    .then(persistVotes(localStorage, getState))
  })


const onVoteSucceeded = (dispatch, optionIndex) => vote =>

  dispatch(voteSucceeded({ optionIndex, vote }))


const onPollLoaded = dispatch => poll => {

  dispatch(pollLoaded(poll))

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


const mapState = ({ poll, votes }, props) => ({ ...props, poll, votes })


export default asyncConnect(asyncState)(connect(mapState)(Poll))
