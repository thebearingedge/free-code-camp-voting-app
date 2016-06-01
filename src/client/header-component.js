
import React from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import { logoutSucceeded } from './actions'


export const Header = props =>

  <div>
    { props.user.username
        ? <Authenticated { ...props }/>
        : <Unauthenticated/> }
  </div>


const Authenticated = ({ user, dispatch }) =>

  <span>
    Welcome back, { user.username }!
    <button onClick={ handleLogout(user, dispatch) }>Log Out</button>
  </span>


const Unauthenticated = _ =>

  <span>
    <Link to='/login'><button>Login</button></Link>
  </span>


const handleLogout = ({ token }, dispatch) => _ =>

  dispatch((_, __, { fetch, localStorage }) =>

    fetch('/api/authenticate', {
      method: 'DELETE',
      headers: { 'x-access-token': token }
    })
    .then(removeUser(localStorage))
    .then(onLogoutSucceeded(dispatch))
  )


const removeUser = localStorage => _ =>

  localStorage.removeItem('user')


const onLogoutSucceeded = dispatch =>

  [push('/login'), logoutSucceeded()].forEach(dispatch)


export default connect()(Header)
