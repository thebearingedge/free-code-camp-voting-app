
import CustomError from 'es6-error'


export class UnauthorizedError extends CustomError {

  constructor(message) {
    super('Unauthorized:' + message)
  }

  get statusCode() { return 401 }

}
