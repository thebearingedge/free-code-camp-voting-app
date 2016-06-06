
import React from 'react'
import color from 'color'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import randomColor from 'randomcolor'
import { asyncConnect } from 'redux-connect'
import PieChart from './pie-chart-component'

import { pollLoaded, voteSucceeded } from './actions'
import VotesCount from './votes-count-component'


export const Poll = ({ poll, votes, user, dispatch }) => {

  const { id, question, options, username, slug } = poll

  if (!votes[id]) {

    return (
      <div>
        <h5>{ question } <VotesCount count={ poll.votes }/></h5>
        <p className='small'>
          { username === user.username
              ? <Link to={ `/user/${username}/${slug}/edit` }>edit</Link>
              : <span>
                  Asked by <Link to={ `/user/${username}` }>{ username }</Link>
                </span> }
        </p>
        <ul className='list-group'>
          { options.map((option, index) =>
              <li key={ option.id }
                  className='poll-option list-group-item'
                  onClick={ castVote(dispatch, index, option, votes) }>
                  <span>{ option.value }</span>
                  <span className='label label-default label-pill pull-xs-right'>
                    { option.votes }
                  </span>
              </li>
            ) }
        </ul>
      </div>
    )
  }

  const chartData = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [],
      hoverBackgroundColor: []
    }]
  }

  options.reduce(({ labels, datasets }, { value, votes }) => {

    const [ dataset ] = datasets
    const { data, backgroundColor, hoverBackgroundColor } = dataset

    const background = randomColor()
    const hoverColor = color(background).desaturate(0.5).hexString()

    labels.push(value)
    data.push(votes)
    backgroundColor.push(background)
    hoverBackgroundColor.push(hoverColor)

    return { labels, datasets }
  }, chartData)

  return (
    <div>
      <h5>{ question } <VotesCount count={ poll.votes }/></h5>
      <p className='small'>
        { username === user.username
            ? <Link to={ `/edit-poll/${id}` }>edit</Link>
            : <span>
                Asked by <Link to={ `/user/${username}` }>{ username }</Link>
              </span> }
      </p>
      <PieChart data={ chartData } width={ 290 } height= { 290 }/>
    </div>
  )
}


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


const mapState = ({ poll, votes, user }, props) => ({
  ...props, poll, votes, user
})


export default asyncConnect(asyncState)(connect(mapState)(Poll))
