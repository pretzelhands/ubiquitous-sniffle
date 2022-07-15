const express = require('express')
const router = express.Router()

const { User } = require('../models')
const { randomIntInRange } = require('../utils')

// GET /api/users/random
// This gets a randomized user for the client to use during their visit
router.get('/random', async (req, res) => {
    const user = await new User({ id: randomIntInRange(1, 10) }).fetch()

    res.json(user)
})

module.exports = router
