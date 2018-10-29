const mongoose = require('mongoose')

//for safety reasons, url is not defined
const url = ''

mongoose.connect(url)

const Person = mongoose.model('Person', {
  name: String,
  number: String
})

if(process.argv.length !== 4) {
  Person
    .find({})
    .then(res => {
      res.forEach(person => {
        console.log(person.name , person.number)
      })
      mongoose.connection.close()
    })
} else {
  const person = new Person({
    name: process.argv[2],
    number: process.argv[3]
  })
  person
    .save()
    .then(response => {
      console.log('henkilön tallentaminen onnistui')
      mongoose.connection.close()
    })
}