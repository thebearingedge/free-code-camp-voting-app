
import 'babel-polyfill'
import express from 'express'
import api from './api'
import { port } from './config'

express()
  .use('/api', api)
  .listen(port, _ => console.log(`listening on ${port}`))
