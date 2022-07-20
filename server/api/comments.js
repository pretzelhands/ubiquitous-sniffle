const express = require('express')
const router = express.Router()

const db = require('../db')
const { Upvote, Comment } = require('../models')
const { dateToRelativeTime } = require('../utils')
const { upvoteSchema, commentSchema } = require("../validation");

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
        ORDER BY c.created_at DESC
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
router.post('/', async (req, res) => {
    const { userId, text } = req.body

    try {
        await commentSchema.validate({ userId, text })
    } catch (e) {
        return res.json({
            success: false,
            errors: e.errors
        })
    }

    const newComment = await Comment.forge({
        user_id: userId,
        text,
    }).save()

    const comment = await Comment
        .where({ id: newComment.id })
        .fetch({ withRelated: ['user'] })

    return res.json({
        success: true,
        id: comment.attributes.id,
        text: comment.attributes.text,
        createdAt: dateToRelativeTime(comment.attributes.created_at),
        upvotes: 0,
        currentUserHasVoted: false,
        user: comment.relations.user
    })
})

// POST /api/comments/:commentId/upvote
router.post('/:commentId/upvote', async (req, res) => {
    const { commentId } = req.params
    const { userId } = req.body

    try {
        await upvoteSchema.validate({ userId, commentId })
    } catch (e) {
        return res.json({
            success: false,
            errors: e.errors
        })
    }

    const existingUpvote = await new Upvote({ comment_id: commentId, user_id: userId }).fetch()
    if (existingUpvote) {
        await existingUpvote.destroy();
        return res.json({
            success: true,
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
        success: true,
        commentId,
        upvoteCount: await Upvote
            .where({ comment_id: commentId })
            .count()
    })
})

module.exports = router
