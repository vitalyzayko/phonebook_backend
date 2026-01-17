const mongoose = require('mongoose')

if (process.argv.length < 3 || process.argv.length > 5) {
  console.log('give DB password, name and phone number as arguments. But not more!')
  process.exit(1)
}



const password = process.argv[2]
const newName = process.argv[3]
const newNumber = process.argv[4]

const url = `mongodb+srv://vitalyzayko:${password}@learningfullstack.jrspuux.mongodb.net/phonebookDB?appName=LearningFullstack`

// mongodb+srv://vitalyzayko:<db_password>@learningfullstack.jrspuux.mongodb.net/?appName=LearningFullstack

mongoose.set('strictQuery',false)

mongoose.connect(url, { family: 4 })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name: newName,
  number: newNumber,
})

/* Person.find({}).then(result => {
  result.forEach(person => {
    console.log(person)
  })
  mongoose.connection.close()
}) */

if (process.argv.length === 3) {
  Person.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(person => {
      console.log(person.name, person.number)
    })
    mongoose.connection.close()
  })
} else {
  person.save().then(result => {
  //console.log("result:", result)
    console.log('added', result.name, 'number', result.number, 'to phonebook')
    mongoose.connection.close()
  })
}


/* person.save().then(result => {
  //console.log("result:", result)
  console.log("added", result.name, "number", result.number, "to phonebook")
  mongoose.connection.close()
}) */