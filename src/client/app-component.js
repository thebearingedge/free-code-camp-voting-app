
import React from 'react'
import { connect } from 'react-redux'

import Header from './header-component'


const App = ({ children, user }) =>

  <div>
    <Header user={ user }/>
    <div className='container'>{ children }</div>
  </div>


const mapState = ({ user }, props) => ({ ...props, user })


export default connect(mapState)(App)
