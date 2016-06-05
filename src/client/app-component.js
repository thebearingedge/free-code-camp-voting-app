
import React from 'react'
import { connect } from 'react-redux'

import Header from './header-component'


const App = ({ children, user }) =>

  <div className='app'>
    <Header user={ user }/>
    <div className='content'>{ children }</div>
  </div>


const mapState = ({ user }, props) => ({ ...props, user })


export default connect(mapState)(App)
