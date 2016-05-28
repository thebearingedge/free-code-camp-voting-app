
import 'babel-polyfill'
import express from 'express'
import router from './api/router'
import { port } from './config'


express()
  .use(express.static(__dirname + '/public'))
  .use('/api', router)
  .use('*', (_, res) => res.sendFile(__dirname + '/public/index.html'))
  .listen(port, _ => console.log(`listening on ${port}`))
