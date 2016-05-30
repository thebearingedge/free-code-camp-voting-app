
import React from 'react'
import { connect } from 'react-redux'
import { asyncConnect } from 'redux-connect'


export const VOTE_SUCCEEDED = 'VOTE_SUCCEEDED'


export const Poll = ({ poll, dispatch }) =>
  <div>
    <p>{ poll.question }</p>
    <ul>
      { poll.options.map(({ id, pollId, value, votes }, index) =>
          <li key={ id }>
            <button onClick={ handleVote(dispatch, index, { id, pollId }) }>
              { value } { votes }
            </button>
          </li>
        ) }
    </ul>
  </div>


const handleVote = (dispatch, optionIndex, { id, pollId }) => e => {

  e.preventDefault()

  return dispatch((_, getState, { fetch, localStorage }) =>

    fetch('/api/vote', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ optionId: id })
    })
    .then(res => res.json())
    .then(voteSucceeded(dispatch, optionIndex))
    .then(storeVotes(localStorage, getState))
  )
}


const voteSucceeded = (dispatch, optionIndex) => vote =>

  dispatch({
    type: VOTE_SUCCEEDED,
    payload: { optionIndex, vote }
  })


const storeVotes = (localStorage, getState) => _ =>

  localStorage.setItem('votes', JSON.stringify(getState().votes))


const asyncProps = [
  {
    key: 'poll',
    promise({ params, helpers }) {

      const { fetch } = helpers
      const { username, slug } = params

      return fetch(`/api/user/${username}/${slug}`)
        .then(res => res.json())
    }
  }
]

const mapState = ({ poll }, props) => ({ ...props, poll })

export default asyncConnect(asyncProps)(connect(mapState)(Poll))
