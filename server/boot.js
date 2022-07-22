const PORT = process.env.PORT || 3000

const createApp = require('./app')
const { app, server } = createApp()

server.on('request', app)
server.listen(PORT, () => console.log('App started'))
