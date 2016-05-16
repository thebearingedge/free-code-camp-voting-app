
import BaseError from 'es6-error'


export class ClientError extends BaseError {

  toJSON() {

    const { error, statusCode, message } = this

    return { error, statusCode, message }
  }

}


export class BadRequest extends ClientError {

  get error() { return 'Bad Request' }

  get statusCode() { return 400 }

}


export class Forbidden extends ClientError {

  get error() { return 'Forbidden' }

  get statusCode() { return 403 }

}


export class NotFound extends ClientError {

  get error() { return 'Not Found' }

  get statusCode() { return 404 }

}


export const errorHandler = (err, req, res, next) => {

  if (err instanceof ClientError) {

    return res.status(err.statusCode).json(err)
  }

  if (err.name === 'ValidationError') {

    return res.status(400).json(err)
  }

  res.status(500).json({ error: 'Internal Server Error' })
}
