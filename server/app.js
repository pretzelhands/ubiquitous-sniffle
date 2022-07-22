const express = require('express')
const cors = require('cors')
const ws = require('ws')
const server = require('http').createServer()

const createApp = () => {
    const wss = new ws.Server({ server })
    const app = express()

    app.use(express.static('../client'))
    app.use(express.json())
    app.use(cors())
    app.use('*', (req, _, next) => {
        req.wss = wss
        next()
    })

    app.get('/', (req, res) => res.sendFile('../client/index.html'))
    app.use('/api/comments', require('./api/comments'))
    app.use('/api/users', require('./api/users'))

    return { app, server }
}

module.exports = createApp
