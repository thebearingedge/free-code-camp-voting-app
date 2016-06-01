
import React from 'react'
import { connect } from 'react-redux'
import { Form, Field, actions as formActions } from 'react-redux-form'
import { push } from 'react-router-redux'

import { loginSucceeded } from './actions'


export const LoginForm = ({ dispatch }) =>

  <Form model='login' onSubmit={ handleLogin(dispatch) }>
    <fieldset className='form-group'>
      <label for='username'>Username</label>
      <Field model='login.username'>
        <input id='username' type='text' className='form-control' required/>
      </Field>
    </fieldset>
    <fieldset className='form-group'>
      <label for='password'>Password</label>
      <Field model='login.password'>
        <input id='password' type='password' className='form-control' required/>
      </Field>
    </fieldset>
    <fieldset className='form-group'>
      <input type='submit' className='btn' value='login'/>
    </fieldset>
  </Form>


export const handleLogin = dispatch => model =>

  dispatch((_, __, { fetch, localStorage }) =>

    fetch('/api/authenticate', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(model)
    })
    .then(res => res.json())
    .then(persistUser(localStorage))
    .then(onLogin(dispatch))
  )


export const persistUser = localStorage => user =>

  localStorage.setItem('user', JSON.stringify(user)) || user


export const onLogin = dispatch => user =>

  [loginSucceeded(user), push('/')].forEach(dispatch)


export default connect()(LoginForm)
