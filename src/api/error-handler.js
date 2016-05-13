
const errorHandler = (err, req, res, next) => res.status(500).json(err)


export default errorHandler
