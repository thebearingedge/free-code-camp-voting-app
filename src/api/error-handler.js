
const errorHandler = (err, req, res, next) => {

  const statusCode = err.statusCode || 500

  const response = {
    statusCode,
    error: err.name,
    message: err.message || 'Internal Server Error',
    details: err.details
  }

  res.status(statusCode).json(response)
}


export default errorHandler
