const personsRouter = require('express').Router()
const Person = require('../models/person')


/* personsRouter.get('/', (request, response) => {
  response.send('<h1> Hi, this is the development version of the Phonebook Backend </h1>')
}) */

personsRouter.get('/', (request, response, next) => {
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

personsRouter.get('/info', (request, response) => {
  Person.find({})
    .then(persons => {
      response.send(`<h2>Phonebook has info about ${persons.length} people </h2>
                    <div> ${request.requestTime} </div>`)
    })
})

personsRouter.get('/:id', (request, response, next) => {
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

personsRouter.put('/:id', (request, response, next) => {
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

personsRouter.delete('/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).send({ error: 'person has been deleted' })
    })

    .catch(error => next(error))

})

personsRouter.post('/', (request, response, next) => {
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

module.exports = personsRouter