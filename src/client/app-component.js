
import React from 'react'
import { connect } from 'react-redux'


const App = ({ children, user }) =>

  <div>
    <h1>Hello { user.username || 'App' }</h1>
    { children }
  </div>


const mapState = ({ user }, props) => ({ ...props, user })


export default connect(mapState)(App)
