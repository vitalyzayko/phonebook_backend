const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.set('strictQuery',false)

mongoose.connect(url, { family: 4 })
    .then(result => {
        console.log("connected to MongoDB")
    })
    .catch(error => {
        console.log("error connectng to mongoDB", error.message)
    })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: function(v) {
        const numberRegex = /^[0-9]{2,3}-[0-9]+$/
        return numberRegex.test(v)
      },
      message: props => `${props.value} is not a valid phone number!` 
    },
    required: true
  }

})

personSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)

/* 

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name: newName,
  number: newNumber,
})

 Person.find({}).then(result => {
  result.forEach(person => {
    console.log(person)
  })
  mongoose.connection.close()
})

if (process.argv.length == 3) {
  Person.find({}).then(result => {
    console.log("phonebook:")
    result.forEach(person => {
      console.log(person.name, person.number)
    })
    mongoose.connection.close()
  })
} else {
  person.save().then(result => {
  //console.log("result:", result)
  console.log("added", result.name, "number", result.number, "to phonebook")
  mongoose.connection.close()
})
}


person.save().then(result => {
  //console.log("result:", result)
  console.log("added", result.name, "number", result.number, "to phonebook")
  mongoose.connection.close()
}) 
  
*/ 