const express = require('express')
const cors = require('cors')

const app = express()

app.use(express.json())
app.use(cors())
app.use('/api/comments', require('./comments'))

app.listen(3000, () => console.log('App started'))
