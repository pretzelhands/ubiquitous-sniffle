const express = require('express')
const router = express.Router()

const db = require('../db')
const { Upvote } = require('../models')
const { dateToRelativeTime } = require('../utils')

// GET /api/comments
router.get('/', async (req, res) => {
    const { userId } = req.query
    const rawComments = await db.knex.raw(`
        SELECT
            c.id as comment_id,
            c.*,
            u.*,
            count(DISTINCT up.id) AS upvotes
        FROM comments c
        LEFT JOIN upvotes up ON c.id = up.comment_id
        JOIN users u ON c.user_id = u.id
        GROUP BY c.id
    `)

    const userVotes = await Upvote.where({ user_id: userId })
        .fetchAll()
        .map(row => row.attributes.comment_id)

    const comments = rawComments.map(data => ({
        id: data.comment_id,
        text: data.text,
        createdAt: dateToRelativeTime(data.created_at),
        upvotes: data.upvotes,
        currentUserHasVoted: userVotes.includes(data.comment_id),
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
router.post('/:commentId/upvote', async (req, res) => {
    const { commentId } = req.params
    const { userId } = req.body

    const existingUpvote = await new Upvote({ comment_id: commentId, user_id: userId }).fetch()
    if (existingUpvote) {
        await existingUpvote.destroy();
        return res.json({
            commentId,
            upvoteCount: await Upvote
                .where({ comment_id: commentId })
                .count(),
        })
    }

    await Upvote
        .forge({comment_id: commentId, user_id: userId})
        .save()

    return res.json({
        commentId,
        upvoteCount: await Upvote
            .where({ comment_id: commentId })
            .count()
    })
})

module.exports = router
