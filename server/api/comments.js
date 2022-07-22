const express = require('express')
const router = express.Router()

const db = require('../db')
const { Upvote, Comment, User } = require('../models')
const { upvoteSchema, commentSchema } = require("../validation");

function mapComment(data, rawComments, userVotes) {
    return {
        id: data.comment_id,
        parentId: data.parent_id,
        text: data.text,
        createdAt: `${data.created_at}Z`,
        upvotes: data.upvotes,
        currentUserHasVoted: userVotes.includes(data.comment_id),
        replies: rawComments
            .filter(child => child.parent_id === data.comment_id)
            .map(child => mapComment(child, rawComments, userVotes)),
        user: {
            id: data.user_id,
            avatar: data.avatar,
            name: data.name,
        }
    }
}

// GET /api/comments
router.get('/', async (req, res) => {
    const { userId } = req.query

    if (!userId) {
        return res.json({
            success: false,
            error: 'User ID required for fetching comments'
        })
    }

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

    const comments = rawComments
        .filter(data => !data.parent_id)
        .map(data => mapComment(data, rawComments, userVotes));

    res.json({
        success: true,
        comments
    })
})

// POST /api/comments
router.post('/', async (req, res) => {
    const { userId, parentId, text } = req.body

    try {
        await commentSchema.validate({ userId, parentId, text })
    } catch (e) {
        return res.json({
            success: false,
            errors: e.errors
        })
    }

    if (parentId) {
        const existingComment = await new Comment({id: parentId}).fetch()
        if (!existingComment) {
            return res.json({
                success: false,
                errors: [
                    'Comment does not exist'
                ]
            })
        }
    }

    const newComment = await Comment.forge({
        user_id: userId,
        parent_id: parentId,
        text,
    }).save()

    const comment = await Comment
        .where({ id: newComment.id })
        .fetch({ withRelated: ['user'] })

    return res.json({
        success: true,
        id: comment.attributes.id,
        parentId: comment.attributes.parent_id,
        text: comment.attributes.text,
        createdAt: `${comment.attributes.created_at}Z`,
        upvotes: 0,
        currentUserHasVoted: false,
        user: comment.relations.user,
        replies: [],
    })
})

// POST /api/comments/:commentId/upvote
router.post('/:commentId/upvote', async (req, res) => {
    const { wss } = req
    const { userId } = req.body
    const { commentId } = req.params
    let data = {}

    try {
        data = await upvoteSchema.validate({ userId, commentId })
    } catch (e) {
        return res.json({
            success: false,
            errors: e.errors
        })
    }

    const existingUser = await new User({ id: data.userId }).fetch()
    if (!existingUser) {
        return res.json({
            success: false,
            errors: [
                'User does not exist'
            ]
        })
    }

    const existingUpvote = await new Upvote({ comment_id: data.commentId, user_id: data.userId }).fetch()
    if (existingUpvote) {
        await existingUpvote.destroy();
    } else {
        await Upvote
            .forge({comment_id: data.commentId, user_id: data.userId})
            .save()
    }

    const upvoteCount = await Upvote
        .where({ comment_id: data.commentId })
        .count()

    wss.clients.forEach(
        client => client.send(
            JSON.stringify({ commentId: data.commentId, userId: data.userId, upvoteCount })
        )
    )

    return res.json({
        success: true,
        commentId: data.commentId,
        upvoteCount,
    })
})

module.exports = router
