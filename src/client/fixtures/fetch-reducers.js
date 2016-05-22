
import { combineReducers } from 'redux'
import { FETCH_LOADING, FETCH_LOADED, FETCH_FAILED } from './fetch-actions'


const loading = (state = false, { type }) => {

  switch (type) {
    case FETCH_LOADING: return true
    case FETCH_LOADED: return false
    case FETCH_FAILED: return false
    default: return state
  }
}


export default combineReducers({ loading })
