const express = require('express')
const morgan = require('morgan')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')

app.use(cors())
app.use(bodyParser.json())
morgan.token('body', req => JSON.stringify(req.body))
app.use(morgan(':method :url :body :status :res[content-length] - :response-time ms'))

let persons = [
    {
      name: "Arto Hellas",
      number: "040-123456",
      id: 1
    },
    {
      name: "Martti Tienari",
      number: "040-123456",
      id: 2
    },
    {
      name: "Arto Järvinen",
      number: "040-123456",
      id: 3
    },
    {
      name: "Lea Kutvonen",
      number: "040-123456",
      id: 4
    }
]

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        res.json(person)
        console.log('Henkilö löytyi')
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()
})

app.post('/api/persons', (req, res) => {
    const body = req.body
    
    if(body.name === undefined) {
        return res.status(400).json({error: 'name is missing'})
    }

    if(body.number === undefined) {
        return res.status(400).json({error: 'number is missing'})
    }

    const name = body.name
    const existing = persons.find(person => person.name === name)

    if(existing) {
        return res.status(400).json({error: 'name is already taken'})
    }

    const person = {
        name: body.name,
        number: body.number,
        id: Math.floor(Math.random() * Math.floor(100000))
    }

    persons = persons.concat(person)
    res.json(person)
})

app.get('/info', (req, res) => {
    const size = persons.length
    const date = new Date()
    console.log('henkilöitä on '+size)
    console.log('tänään on '+date)
    res.send(`
        <div>
            <p>puhelinluettelossa ${size} henkilön tiedot</p>
        </div>
        <div>
            <p>${date}</p>
        </div>`)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Päristelee portissa ${PORT}`)
})