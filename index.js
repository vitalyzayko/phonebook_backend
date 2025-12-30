require("dotenv").config()

const express = require('express')
const app = express()
const morgan = require("morgan")
const Person = require("./models/note")

app.use(express.json())

app.use(express.static('dist'))

const requestTime = (request, response, next) => {
    request.requestTime = Date()
    next()
}

app.use(requestTime)


morgan.token('body', (request, response) => 
  { if (request.method == "POST") {
    return body = JSON.stringify(request.body)
    } 
  })


morgan.format("tinyBodyPost", ":method :url :status :res[content-length] - :response-time ms :body")

app.use(morgan("tinyBodyPost"))


/* let persons = [
  { id: "1", name: "Arto Hellas", number: "040-123456" },
  { id: "2", name: "Ada Lovelace", number: "39-44-5323523" },
  { id: "3", name: "Dan Abramov", number: "12-43-234345" },
  { id: "4", name: "Mary Poppendieck", number: "39-23-6423122" },
  { id: "5", name: "Vitaly Zayko", number: "123-4567890" },
  { id: "6", name: "John Doe", number: "555-5555555" },
  { id: "7", name: "Jane Smith", number: "444-4444444" }
] */

app.get("/", (request, response) => {
    response.send("<h1> Hi, this is the development version of the Phonebook Backend </h1>")
})

app.get('/api/persons', (request, response) => {
  Person.find({})
    .then(persons => {
      response.json(persons)
    })
})

app.get("/info", (request, response) => {
  Person.find({})
    .then(persons => {
      response.send(`<h2>Phonebook has info about ${persons.length} people </h2>
                    <div> ${request.requestTime} </div>`)
    })  
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id)
    .then(person => {
      response.json(person)
      mongoose.connection.close()

    })
  
/* 
  const id = request.params.id
  const person = persons.find(person => person.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
*/

})

app.delete('/api/persons/:id', (request, response) => {
  Person.findByIdAndDelete(request.params.id)
    .then(person => {
      response.json(person)
      mongoose.connection.close()

    })
  
/* 
  const id = request.params.id
  persons = persons.filter(p => p.id !== id)

  response.status(204).end()
*/

})

/* 
const generateId = () => {
  const maxID = persons.length > 0
    ? Math.max(...persons.map(p => Number(p.id)))
    : 0
    return String(maxID + 1)
} 
*/

app.post('/api/persons', (request, response) => {
  const body = request.body
  
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "The name or number is missing"
    })
  }

  Person.find({ name: body.name })
    .then(result => {
      if (result) {
        return response.status(400).json({
          error: "The name already exists in the phonebook. It must be unique"
        })
      } else {
        const person = new Person ({
          name: body.name,
          number: body.number,
        })
        person.save().then(result => {
        console.log("added", result.name, "number", result.number, "to phonebook")
        })
      }
    mongoose.connection.close()
  })

})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})