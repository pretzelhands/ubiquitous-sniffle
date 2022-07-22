const PORT = process.env.PORT || 3000

const express = require('express')
const cors = require('cors')
const ws = require('ws')
const server = require('http').createServer()

const wss = new ws.Server({ server })
const app = express()

app.use(express.json())
app.use(cors())
app.use('*', (req, _, next) => {
    req.wss = wss
    next()
})

app.use('/api/comments', require('./api/comments'))
app.use('/api/users', require('./api/users'))

server.on('request', app)
server.listen(PORT, () => console.log('App started'))
