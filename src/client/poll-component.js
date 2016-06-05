
import React from 'react'
import color from 'color'
import { connect } from 'react-redux'
import randomColor from 'randomcolor'
import { asyncConnect } from 'redux-connect'
import PieChart from './pie-chart-component'

import { pollLoaded, voteSucceeded } from './actions'


export const Poll = ({ poll, votes, dispatch }) => {

  const { id, question, options } = poll

  if (!votes[id]) {

    return (
      <div>
        <p>{ question }</p>
        <ul>
          { options.map((option, index) =>
              <li key={ option.id }>
                <button onClick={ castVote(dispatch, index, option, votes) }>
                  { option.value } { option.votes }
                </button>
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
      <h3>{ question }</h3>
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


const mapState = ({ poll, votes }, props) => ({ ...props, poll, votes })


export default asyncConnect(asyncState)(connect(mapState)(Poll))
