
import React from 'react'
import { connect } from 'react-redux'
import { asyncConnect } from 'redux-connect'
import { Link } from 'react-router'

import { pollsLoaded } from './actions'


export const PollsList = ({ polls }) =>

  <ul>
    { polls.map(({ id, question, username, slug, votes }) =>
      <li key={ id }>
        <Link to={ `/${username}/${slug}` }>
          <h4>{ question }</h4>
          <span>by { username } <VotesCount count={ votes }/></span>
        </Link>
      </li>
      ) }
  </ul>


const VotesCount = ({ count }) =>
  <span>
    ({ count } vote{ Number(count) === 1 ? '' : 's'})
  </span>


const onPollsLoaded = dispatch => polls => {

  dispatch(pollsLoaded(polls))

  return polls
}


const asyncProps = [
  {
    key: 'polls',
    promise: ({ helpers, store }) => {

      const { fetch } = helpers
      const { dispatch } = store

      return fetch('/api/polls')
        .then(res => res.json())
        .then(onPollsLoaded(dispatch))
    }
  }
]


const mapState = ({ polls }, props) => ({ ...props, polls })


export default asyncConnect(asyncProps)(connect(mapState)(PollsList))
