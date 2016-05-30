
import React from 'react'
import { asyncConnect } from 'redux-connect'
import { Link } from 'react-router'


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


export const VotesCount = ({ count }) =>
  <span>
    ({ count } vote{ Number(count) === 1 ? '' : 's'})
  </span>


const asyncProps = [
  {
    key: 'polls',
    promise: ({ helpers }) => helpers
      .fetch.call(global, '/api/polls')
      .then(res => res.json())
  }
]


const mapState = ({ polls }) => ({ polls })


export default asyncConnect(asyncProps, mapState)(PollsList)
