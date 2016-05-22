
import { expect, stub } from '@thebearingedge/test-utils'
import { createStore, applyMiddleware } from 'redux'
import reducers from '../fixtures/fetch-reducers'
import {
  FETCH_LOADING, FETCH_LOADED, FETCH_FAILED
} from '../fixtures/fetch-actions'
import { reduxFetch, FETCH } from '../redux-fetch'


describe('redux-fetch', () => {

  const ctx = { fetch() {} }
  const res = { json() {} }

  let fetch, store, dispatch, subscribe, getState

  const handlers = {
    [FETCH_LOADING]: _ => ({ type: FETCH_LOADING }),
    [FETCH_LOADED]: _ => ({ type: FETCH_LOADED }),
    [FETCH_FAILED]: _ => ({ type: FETCH_FAILED })
  }

  beforeEach(() => {
    fetch = stub(ctx, 'fetch')
    store = createStore(reducers, applyMiddleware(reduxFetch(fetch, handlers)))
    dispatch = store.dispatch
    subscribe = store.subscribe
    getState = store.getState
    expect(getState()).to.deep.equal({ loading: false })
  })

  afterEach(() => fetch.restore())

  it('dispatches a loading action', done => {

    fetch.resolves(res)

    subscribe(_ => {
      expect(fetch).not.to.have.been.called
      expect(getState()).to.deep.equal({ loading: true })
      done()
    })

    dispatch({
      type: FETCH,
      meta: {
        request: FETCH_LOADING
      }
    }).catch(done)
  })

  it('dispatches a success action', done => {

    fetch.resolves(res)

    dispatch(handlers[FETCH_LOADING]())

    expect(getState()).to.deep.equal({ loading: true })

    subscribe(_ => {
      expect(getState()).to.deep.equal({ loading: false })
      done()
    })

    dispatch({
      type: FETCH,
      meta: {
        success: FETCH_LOADED
      }
    }).catch(done)
  })

  it('dispatches a failure action', done => {

    fetch.rejects()

    dispatch(handlers[FETCH_LOADING]())

    expect(getState()).to.deep.equal({ loading: true })

    subscribe(_ => {
      expect(getState()).to.deep.equal({ loading: false })
      done()
    })

    dispatch({
      type: FETCH,
      meta: {
        failure: FETCH_FAILED
      }
    }).catch(done)
  })

  it('makes a GET request', done => {

    fetch.resolves(res)

    subscribe(_ => {
      expect(fetch).to.have.been.calledWithExactly('/foo?bar=baz', {
        method: undefined,
        headers: undefined,
        body: undefined
      })
      done()
    })

    dispatch({
      type: FETCH,
      payload: {
        url: '/foo',
        params: { bar: 'baz' }
      },
      meta: {
        success: FETCH_LOADED
      }
    }).catch(done)
  })

  it('makes a PUT request', done => {

    fetch.resolves(res)

    const body = { foo: 'bar' }

    subscribe(_ => {
      expect(fetch).to.have.been.calledWithExactly('/foo', {
        method: 'put',
        headers: undefined,
        body
      })
      done()
    })

    dispatch({
      type: FETCH,
      payload: {
        url: '/foo',
        method: 'put',
        body
      },
      meta: {
        success: FETCH_LOADED
      }
    }).catch(done)
  })

})
