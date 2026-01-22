const logger = require('./logger')
//const morgan = require('morgan')

const requestTime = (request, response, next) => {
  request.requestTime = Date()
  next()
}

//morgan.token('body', (request, response) =>
//{ if (request.method === 'POST') {
//  return body = JSON.stringify(request.body)
//}
//})

//morgan.format('tinyBodyPost', ':method :url :status :res[content-length] - :response-time ms :body')


const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:', request.path)
  logger.info('Body:', request.body)
  logger.info('---')
  next()
}


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}


const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}


module.exports = {
  requestTime,
  requestLogger,
  unknownEndpoint,
  errorHandler
}