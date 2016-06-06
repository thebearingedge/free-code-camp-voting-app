
import { window, document, fetch, localStorage } from 'global'

import React from 'react'
import thunk from 'redux-thunk'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { ReduxAsyncConnect } from 'redux-connect'
import { Router, browserHistory } from 'react-router'
import { syncHistoryWithStore, routerMiddleware } from 'react-router-redux'

import routes from './routes'
import createAppStore from './app-store'


const login = {}
const pollForm = { options: [] }
const user = JSON.parse(localStorage.getItem('user')) || {}
const votes = JSON.parse(localStorage.getItem('votes')) || {}

const initialState = { user, votes, login, pollForm }

const middlewares = [
  routerMiddleware(browserHistory),
  thunk.withExtraArgument({ fetch, localStorage })
]

const store = createAppStore(middlewares, initialState)
const history = syncHistoryWithStore(browserHistory, store)


const asyncState = props =>

  <ReduxAsyncConnect { ...props } helpers={{ fetch }}/>


window.addEventListener('DOMContentLoaded', _ => {

  render(
    <Provider store={ store } key='provider'>
      <Router render={ asyncState } history={ history } routes={ routes }/>
    </Provider>
  , document.querySelector('#app'))
})
