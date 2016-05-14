
import express from 'express'
import api from './api'
import { port } from './config'

express()
  .use(api)
  .listen(port, _ => console.log(`listening on ${port}`))
