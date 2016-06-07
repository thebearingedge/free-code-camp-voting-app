
import React from 'react'
import { connect } from 'react-redux'
import { asyncConnect } from 'redux-connect'

import { optionAdded, optionUpdated, questionUpdated,
         pollFormCleared, pollFormLoaded } from './actions'


export const PollForm = ({ pollForm, user, dispatch }) =>

  <div className='center-box'>
    <form>
      <fieldset className='form-group'>
        <input id='question'
               className='form-control'
               placeholder='What do you want to know?'
               type='text'
               value={ pollForm.question }
               onChange={ handleQuestionChange(dispatch) }
               disabled={ !!pollForm.id }
               required/>
      </fieldset>
      <fieldset className='form-group'>
        <div className='input-group'>
          <input className='form-control'
                 type='text'
                 value={ pollForm.adding }
                 onChange={ handleUpdateOption(dispatch) }
                 placeholder='Option'/>
          <span className='input-group-btn'>
            <button className='btn btn-secondary'
                    type='button'
                    onClick={ handleAddOption(dispatch, user, pollForm) }>
              Add
            </button>
          </span>
        </div>
      </fieldset>
      <h5>{ pollForm.question }</h5>
      <ul className='plain-list'>
        { pollForm.options.map(({ value }, i) =>
             <li key={ i }>{ value }</li>
          ) }
      </ul>
      <button type={ pollForm.id ? 'button' : 'submit' }
              className='btn btn-primary form-control'>
        Done
      </button>
    </form>
  </div>


const handleQuestionChange = dispatch => ({ target }) =>

  dispatch(questionUpdated(target.value))


const handleUpdateOption = dispatch => ({ target }) => {

  const { value } = target

  value.trim() && dispatch(optionUpdated(value))
}


const handleAddOption = (dispatch, { token }, { id, adding, options }) => _ => {

  const newValue = adding.trim()

  if (!newValue) return

  if (options.some(({ value }) => value === newValue)) return

  const option = { value: newValue }

  if (!id) return dispatch(optionAdded(option))

  dispatch((_, __, { fetch }) =>

    fetch(`/api/polls/${id}/options`, {
      method: 'POST',
      headers: {
        'x-access-token': token,
        'content-type': 'application/json'
      },
      body: JSON.stringify(option)
    })
    .then(res => res.json())
    .then(added => dispatch(optionAdded(added)))
  )
}


const newPollState = [
  {
    key: 'pollForm',
    promise: ({ store }) => store.dispatch(pollFormCleared())
  }
]


const editPollState = [
  {
    key: 'pollForm',
    promise({ helpers, store, params }) {

      const { fetch } = helpers
      const { dispatch } = store
      const { pollId } = params

      return fetch(`/api/polls/${pollId}`)
        .then(res => res.json())
        .then(onPollFormLoaded(dispatch))
    }
  }
]


const onPollFormLoaded = dispatch => poll => {

  dispatch(pollFormLoaded(poll))

  return poll
}


const mapState = ({ pollForm, user }, props) => ({ ...props, pollForm, user })


export const NewPoll = asyncConnect(newPollState)(connect(mapState)(PollForm))


export const EditPoll = asyncConnect(editPollState)(connect(mapState)(PollForm))
