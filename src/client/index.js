
import { window, document, fetch, localStorage } from 'global'

import React from 'react'
import { render } from 'react-dom'

import { Router, browserHistory } from 'react-router'

import { createStore, combineReducers, applyMiddleware } from 'redux'
import { ReduxAsyncConnect, reducer as reduxAsyncConnect } from 'redux-connect'
import { LOAD_SUCCESS } from 'redux-connect/lib/store'
import thunk from 'redux-thunk'
import { Provider } from 'react-redux'
import { modelReducer, formReducer } from 'react-redux-form'
import { syncHistoryWithStore,
         routerMiddleware, routerReducer } from 'react-router-redux'

import routes from './routes'


const loginState = {}

const user = JSON.parse(localStorage.getItem('user') || '{}')
const votes = JSON.parse(localStorage.getItem('votes') || '{}')


const userReducer = (state = user, { type, payload }) =>

  type === 'LOGIN_SUCCEEDED'
    ? payload
    : state


const votesReducer = (state = votes, { type, payload }) =>

  type === 'VOTE_SUCCEEDED'
    ? { [payload.vote.pollId]: payload.vote, ...state }
    : state


const pollReducer = (state = { options: [] }, { type, payload }) => {

  if (type !== 'VOTE_SUCCEEDED' && type !== LOAD_SUCCESS) return state

  if (type === LOAD_SUCCESS) return payload.key === 'poll' ? payload.data : state

  const { optionIndex: index, vote } = payload

  if (vote.pollId !== state.id) return state

  const { options } = state
  const option = options[index]

  const upVoted = { ...option, votes: option.votes + 1 }

  const updated = {
    ...state,
    votes: state.votes + 1,
    options: [...options.slice(0, index), upVoted, ...options.slice(index + 1)]
  }

  return updated
}


const rootReducer = combineReducers({
  reduxAsyncConnect,
  user: userReducer,
  poll: pollReducer,
  votes: votesReducer,
  routing: routerReducer,
  login: modelReducer('login', loginState),
  loginForm: formReducer('login', loginState)
})

const middlewares = [
  routerMiddleware(browserHistory),
  thunk.withExtraArgument({ fetch, localStorage })
]

const store = applyMiddleware(...middlewares)(createStore)(rootReducer)

const history = syncHistoryWithStore(browserHistory, store)


const asyncProps = props =>

  <ReduxAsyncConnect { ...props } helpers={{ fetch }}/>


window.addEventListener('DOMContentLoaded', _ => {

  render(
    <Provider store={ store } key='provider'>
      <Router render={ asyncProps } history={ history } routes={ routes }/>
    </Provider>
  , document.querySelector('#app'))
})
