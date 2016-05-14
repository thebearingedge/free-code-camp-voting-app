
import { ClientError } from './errors'


const errorHandler = (err, req, res, next) => {

  if (err instanceof ClientError) {

    return res.status(err.statusCode).json(err)
  }

  res.status(500).json({ error: 'Internal Server Error' })
}


export default errorHandler
