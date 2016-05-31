
import { window, document, fetch, localStorage } from 'global'

import React from 'react'
import { render } from 'react-dom'

import { Router, browserHistory } from 'react-router'

import { createStore, combineReducers, applyMiddleware } from 'redux'
import { ReduxAsyncConnect, reducer as reduxAsyncConnect } from 'redux-connect'
import thunk from 'redux-thunk'
import { Provider } from 'react-redux'
import { modelReducer, formReducer } from 'react-redux-form'
import { syncHistoryWithStore,
         routerMiddleware, routerReducer } from 'react-router-redux'

import routes from './routes'
import { userReducer, pollReducer,
         pollsReducer, userVotesReducer } from './reducers'


const loginState = {}
const user = JSON.parse(localStorage.getItem('user') || '{}')
const userVotes = JSON.parse(localStorage.getItem('userVotes') || '{}')

const rootReducer = combineReducers({
  reduxAsyncConnect,
  poll: pollReducer,
  polls: pollsReducer,
  routing: routerReducer,
  user: userReducer(user),
  userVotes: userVotesReducer(userVotes),
  login: modelReducer('login', loginState),
  loginForm: formReducer('login', loginState)
})

const middlewares = [
  routerMiddleware(browserHistory),
  thunk.withExtraArgument({ fetch, localStorage })
]

const store = applyMiddleware(...middlewares)(createStore)(rootReducer)

const history = syncHistoryWithStore(browserHistory, store)


const asyncState = props =>

  <ReduxAsyncConnect { ...props } helpers={{ fetch }}/>


window.addEventListener('DOMContentLoaded', _ => {

  const app = document.querySelector('#app')

  render(
    <Provider store={ store } key='provider'>
      <Router render={ asyncState } history={ history } routes={ routes }/>
    </Provider>
  , app)
})
