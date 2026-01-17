require('dotenv').config()

const express = require('express')
const app = express()
const morgan = require('morgan')
const Person = require('./models/person')

app.use(express.json())

app.use(express.static('dist'))



const requestTime = (request, response, next) => {
  request.requestTime = Date()
  next()
}

app.use(requestTime)


morgan.token('body', (request, response) =>
{ if (request.method === 'POST') {
  return body = JSON.stringify(request.body)
}
})


morgan.format('tinyBodyPost', ':method :url :status :res[content-length] - :response-time ms :body')

app.use(morgan('tinyBodyPost'))

app.get('/', (request, response) => {
  response.send('<h1> Hi, this is the development version of the Phonebook Backend </h1>')
})

app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then(persons => {
      if (persons) {
        response.json(persons)
      } else {
        response.status(404).send({ error:'No persons found' })
      }
    })
    .catch(error => next(error))
})

app.get('/info', (request, response) => {
  Person.find({})
    .then(persons => {
      response.send(`<h2>Phonebook has info about ${persons.length} people </h2>
                    <div> ${request.requestTime} </div>`)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).send({ error:'person not found' })
      }
    })
    .catch(error => next(error))

})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Person.findById(request.params.id)
    .then(person => {
      if (!person) {
        response.status(404).send({ error:'person not found' })
      }

      person.name = name
      person.number = number

      return person.save().then((updatedPerson) => {
        response.json(updatedPerson)
      })
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).send({ error: 'person has been deleted' })
    })

    .catch(error => next(error))

})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({
      error: 'content is missing'
    })
  }

  const person = new Person ({
    name: body.name,
    number: body.number,
  })

  person.save()
    .then(result => {
      console.log('added', result.name, 'number', result.number, 'to phonebook')
    })
    .catch(
      error => next(error)
    )



})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})