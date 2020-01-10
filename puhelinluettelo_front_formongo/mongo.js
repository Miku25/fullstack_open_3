const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://mhar1:${password}@testingcluster-0mnru.mongodb.net/phonebook-app?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv[3]) {
    const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
    })


    person.save().then(response => {
        console.log(`added ${response.name} number ${response.number} to the phonebook`);
        mongoose.connection.close();
    })

} else {
    Person.find({}).then(result => {
        result.forEach(person => {
          console.log(person)
        })
        mongoose.connection.close()
      })
}

