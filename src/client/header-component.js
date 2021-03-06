
import React from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import { logoutSucceeded } from './actions'


export const Header = props =>

  <nav className='navbar navbar-full navbar-dark bg-inverse'>
    <Link to='/' className='navbar-brand'><span>Votif&nbsp;</span></Link>
    { props.user.username
      ? <ProfileLink username={ props.user.username }/>
      : null }
    <div className='pull-xs-right'>
      { props.user.username
          ? <Authenticated { ...props }/>
          : <Unauthenticated/> }
    </div>
  </nav>


const Authenticated = ({ user, dispatch }) =>

  <ul className='nav navbar-nav'>
    <NavLink to='/' onClick={ handleLogout(user, dispatch) }>Log Out</NavLink>
  </ul>


const Unauthenticated = _ =>

  <ul className='nav navbar-nav'>
    <NavLink to='/signup' activeClassName='active'>Sign Up</NavLink>
    <NavLink to='/login' activeClassName='active'>Login</NavLink>
  </ul>


const ProfileLink = ({ username }) =>

  <ul className='nav navbar-nav'>
    <NavLink to={ `/user/${username}` } activeClassName='active'>
      My Polls
    </NavLink>
  </ul>


const NavLink = props =>

  <li className='nav-item'>
    <Link { ...props } className='nav-link'/>
  </li>


const handleLogout = ({ token }, dispatch) => event =>

  event.preventDefault() ||

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


export default connect(null, null, null, { pure: false })(Header)
