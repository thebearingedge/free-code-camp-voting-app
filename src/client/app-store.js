
import { routerReducer as routing } from 'react-router-redux'
import { modelReducer, formReducer } from 'react-redux-form'
import { reducer as reduxAsyncConnect } from 'redux-connect'
import { createStore, combineReducers, applyMiddleware } from 'redux'

import { user, poll, userPolls, polls, votes, profile } from './reducers'

export default function createAppStore(middlewares, initialState) {

  const rootReducer = combineReducers({
    user,
    poll,
    polls,
    votes,
    profile,
    routing,
    userPolls,
    reduxAsyncConnect,
    login: modelReducer('login'),
    loginForm: formReducer('login')
  })

  return createStore(rootReducer, initialState, applyMiddleware(...middlewares))
}
