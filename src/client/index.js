
import React from 'react'
import { window, document } from 'global'
import { render } from 'react-dom'
import { Router, browserHistory } from 'react-router'

import routes from './routes'


window.addEventListener('DOMContentLoaded', _ => {

  const app = document.querySelector('#app')

  render(<Router history={ browserHistory } routes={ routes }/>, app)
})
