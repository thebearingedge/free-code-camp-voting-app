
import 'babel-polyfill'
import express from 'express'
import router from './api/router'
import { port } from './config'


express()
  .use(express.static(__dirname + '/public'))
  .use('/api', router)
  .listen(port, _ => console.log(`listening on ${port}`))
