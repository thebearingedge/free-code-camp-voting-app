
import BaseError from 'es6-error'


export class ClientError extends BaseError {

  toJSON() {

    const { name: error, statusCode, message } = this

    return { error, statusCode, message }
  }

}


export class Unauthorized extends ClientError {

  get statusCode() { return 401 }

}


export class NotFound extends ClientError {

  get statusCode() { return 404 }

}
