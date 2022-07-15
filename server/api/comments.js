const express = require('express')
const router = express.Router()

const db = require('../db')
const { dateToRelativeTime } = require('../utils')

// GET /api/comments
router.get('/', async (req, res) => {
    const rawComments = await db.knex.raw(`
        SELECT
            c.*,
            u.*,
            count(DISTINCT up.id) AS upvotes
        FROM comments c
        JOIN upvotes up ON c.id = up.comment_id
        JOIN users u ON c.user_id = u.id
        GROUP BY c.id
    `)

    const comments = rawComments.map(data => ({
        id: data.id,
        text: data.text,
        createdAt: dateToRelativeTime(data.created_at),
        upvotes: data.upvotes,
        user: {
            id: data.user_id,
            avatar: data.avatar,
            name: data.name,
        }
    }));

    res.json(comments)
})

// POST /api/comments
router.post('/', (req, res) => {

})

// POST /api/comments/:commentId/upvote
router.post('/:commentId/upvote', (req, res) => {
    const {commentId} = req.params
})

module.exports = router
