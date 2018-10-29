const express = require('express')
const morgan = require('morgan')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const Person = require('./models/person')

app.use(cors())
app.use(bodyParser.json())
app.use(express.static('build'))
morgan.token('body', req => JSON.stringify(req.body))
app.use(morgan(':method :url :body :status :res[content-length] - :response-time ms'))

app.get('/api/persons', (req, res) => {
    Person
        .find({})
        .then(persons => {
            res.json(persons.map(Person.format))
        })
})

app.get('/api/persons/:id', (req, res) => {
    Person
        .findById(req.params.id)
        .then(person => {
            if(person) {
                res.json(Person.format(person))
            } else {
                res.status(404).end()
            }
        })
        .catch(error => {
            console.log(error)
            res.status(400).send({ error: 'malformatted id' })
        })
})

app.delete('/api/persons/:id', (req, res) => {
    Person
        .findByIdAndRemove(req.params.id)
        .then(result => {
            res.status(204).end()
        })
        .catch(error => {
            res.status(400).send({ error: 'malformatted id' })
        })
})

app.put('api/persons/:id', (req, res) => {
    const body = req.body
    const person = {
        name: body.name,
        number: body.number
    }

    Person
        .findByIdAndUpdate(req.params.id, person)
        .then(changePerson => {
            res.json(Person.format(changePerson))
        })
        .catch(error => {
            res.status(400).send({ error: 'malformatted id' })
        })
})

app.post('/api/persons', (req, res) => {
    const body = req.body
    
    if(body.name === undefined) {
        return res.status(400).json({ error: 'name is missing' })
    }

    if(body.number === undefined) {
        return res.status(400).json({ error: 'number is missing' })
    }

    const person = new Person({
        name: body.name,
        number: body.number,
        id: Math.floor(Math.random() * Math.floor(100000))
    })

    Person
        .find({ name: person.name })
        .then(result => {
            if(!(result.length <= 0)) {
                res.status(400).send({ error: 'give name already exists' })
            } else {
                person
                    .save()
                    .then(newPerson => {
                        res.json(Person.format(newPerson))
                    })
            }
        })
})

app.get('/info', (req, res) => {
    Person
        .find({})
        .then(persons => {
            res.send(
                `<p>puhelinluettelossa on ${persons.length} henkilön tiedot</p>
                <p>${new Date()}</p>
                `
            )
        })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Päristelee portissa ${PORT}`)
})