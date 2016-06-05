
import React from 'react'
import { connect } from 'react-redux'
import { asyncConnect } from 'redux-connect'
import { Link } from 'react-router'

import { pollsLoaded } from './actions'
import VotesCount from './votes-count-component'


export const PollsList = ({ polls }) =>

  <ul className='plain-list'>
    { polls.map(({ id, question, username, slug, votes }) =>
      <li key={ id }>
        <strong>
          <Link to={ `/poll/${username}/${slug}` }>{ question }</Link>
        </strong>
        &nbsp;<VotesCount count={ votes }/>
        <br/>
        <span className='small'>
          Asked by <Link to={ `/user/${username}` }>{ username }</Link>
        </span>
      </li>
      ) }
  </ul>


const onPollsLoaded = dispatch => polls => {

  dispatch(pollsLoaded(polls))

  return polls
}


const asyncState = [
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


export default asyncConnect(asyncState)(connect(mapState)(PollsList))
