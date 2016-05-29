
import { window, document, fetch, localStorage } from 'global'

import React from 'react'
import { render } from 'react-dom'

import { Router, browserHistory } from 'react-router'

import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { Provider } from 'react-redux'
import { modelReducer, formReducer } from 'react-redux-form'
import { syncHistoryWithStore,
         routerMiddleware, routerReducer } from 'react-router-redux'

import routes from './routes'


const loginState = {}

const user = JSON.parse(localStorage.getItem('user') || '{}')

const userReducer = (state = user, { type, payload }) =>

  type === 'LOGIN_SUCCEEDED' ? payload : state

const rootReducer = combineReducers({
  user: userReducer,
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


window.addEventListener('DOMContentLoaded', _ => {

  render(
    <Provider store={ store }>
      <Router history={ history } routes={ routes }/>
    </Provider>
  , document.querySelector('#app'))
})
