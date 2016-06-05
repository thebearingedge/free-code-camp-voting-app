
import React from 'react'
import { connect } from 'react-redux'
import { asyncConnect } from 'redux-connect'
import { Form, Field, actions as formActions } from 'react-redux-form'
import { push, replace } from 'react-router-redux'

import { loginSucceeded } from './actions'


export const Credentials = ({ endpoint, dispatch }) =>

  <div className='center-box'>
    <h3>{ endpoint === 'signup' ? 'Join Votif' : 'Welcome Back' }</h3>
    <hr/>
    <Form model='login' onSubmit={ handleSubmit(endpoint, dispatch) }>
      <fieldset className='form-group'>
        <label for='username'>Username</label>
        <Field model='login.username'>
          <input id='username' type='text' className='form-control' required/>
        </Field>
      </fieldset>
      <fieldset className='form-group'>
        <label for='password'>Password</label>
        <Field model='login.password'>
          <input id='password'
                 type='password'
                 className='form-control' required/>
        </Field>
      </fieldset>
      <fieldset className='form-group'>
        <input
          type='submit'
          className='btn btn-primary form-control m-t-1'
          value={ endpoint === 'signup' ? 'Sign Up' : 'Login' }/>
      </fieldset>
    </Form>
  </div>


export const LoginForm = props =>

  <Credentials endpoint={ 'authenticate' } { ...props }/>


export const SignUpForm = props =>

  <Credentials endpoint={ 'signup' } { ...props }/>


export const handleSubmit = (endpoint, dispatch) => model =>

  dispatch((_, __, { fetch, localStorage }) =>

    fetch(`/api/${endpoint}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(model)
    })
    .then(res => res.json())
    .then(persistUser(localStorage))
    .then(onLoginSucceeded(dispatch))
  )


export const persistUser = localStorage => user =>

  localStorage.setItem('user', JSON.stringify(user)) || user


export const onLoginSucceeded = dispatch => user =>

  [loginSucceeded(user), push(`/user/${user.username}`)].forEach(dispatch)


const asyncState = [
  {
    key: 'user',
    promise: ({ store, router }) => {

      const { dispatch, getState } = store

      dispatch(formActions.change('login', {}))

      const { username, token } = getState().user

      if (token) dispatch(replace(`/user/${username}`))
    }
  }
]


export const Login = asyncConnect(asyncState)(connect()(LoginForm))

export const SignUp = asyncConnect(asyncState)(connect()(SignUpForm))
