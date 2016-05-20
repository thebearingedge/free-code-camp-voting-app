
import 'babel-polyfill'
import express from 'express'
import router from './router'
import { port } from '../config'

express()
  .use('/api', router)
  .listen(port, _ => console.log(`listening on ${port}`))
