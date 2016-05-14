
import BaseError from 'es6-error'


export class ClientError extends BaseError {

  toJSON() {

    const { statusCode, message } = this

    return { statusCode, message }
  }
}


export class Unauthorized extends ClientError {

  constructor(message) {
    super(message)
  }

  get statusCode() { return 401 }

}

export class NotFound extends ClientError {

  constructor(message) {
    super(message)
  }

  get statusCode() { return 404 }
}
