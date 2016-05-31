
import React from 'react'
import { connect } from 'react-redux'
import { Form, Field, actions as formActions } from 'react-redux-form'
import { push } from 'react-router-redux'

import { loginSucceeded } from './actions'


export const LoginForm = ({ dispatch }) =>

  <Form model='login' onSubmit={ handleLogin(dispatch) }>
    <label for='username'>Username</label>
    <Field model='login.username'>
      <input id='username' type='text' required/>
    </Field>
    <label for='password'>Password</label>
    <Field model='login.password'>
      <input id='password' type='password' required/>
    </Field>
    <input type='submit' value='login'/>
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


export const clearLogin = _ => formActions.change('login', {})


export const onLogin = dispatch => user =>

  [loginSucceeded(user), push('/'), clearLogin()].forEach(dispatch)


export default connect()(LoginForm)
