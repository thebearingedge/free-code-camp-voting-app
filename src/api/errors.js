
import BaseError from 'es6-error'


export class CustomError extends BaseError {

  toJSON() {

    const { error, statusCode, message, details } = this

    return { error, statusCode, message, details }
  }

}


export class InternalServerError extends CustomError {

  get error() { return 'Internal Server Error' }

  get statusCode() { return 500 }

}


export class ClientError extends CustomError {}


export class BadRequest extends ClientError {

  get error() { return 'Bad Request' }

  get statusCode() { return 400 }

}


export class ValidationError extends BadRequest {

  constructor(message, details) {

    super(message)

    this.details = details
  }

}


export class Forbidden extends ClientError {

  get error() { return 'Forbidden' }

  get statusCode() { return 403 }

}


export class NotFound extends ClientError {

  get error() { return 'Not Found' }

  get statusCode() { return 404 }

}


export const notFoundHandler = ({ originalUrl }) => {

  throw new NotFound(`route '${originalUrl}' does not exist`)
}


export const errorHandler = (err, req, res, next) => {

  const error = err instanceof ClientError
    ? err
    : new InternalServerError()

  res.status(error.statusCode).json(error)
}
