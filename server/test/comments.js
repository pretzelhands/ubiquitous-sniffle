const test = require('ava')
const request = require('supertest')

const db = require('../db')
const createApp = require('../app')

const { app } = createApp()

test.serial.before(async t => {
        await db.knex('comments').truncate()
        await db.knex('upvotes').truncate()
        await db.knex('users').truncate()

        await db.knex('users').insert([
            { name: 'Richard Blechinger', avatar: 'https://placehold.it/128x128' },
            { name: "John O'Nolan", avatar: 'https://placehold.it/128x128' },
            { name: "Ronald Langeveld", avatar: 'https://placehold.it/128x128' },
            { name: "Daniel Lockyer", avatar: 'https://placehold.it/128x128' },
        ])

        await db.knex('comments').insert([
            { user_id: 1, text: 'I think this is a really great test suite.' },
            { user_id: 3, text: "I'm inclined to agree! Really good!", parent_id: 1 },
            { user_id: 4, text: 'You guys must be out of your mind! Who wrote this mess!?', parent_id: 1 },
            { user_id: 2, text: 'I just really, really like boats.' }
        ])

        await db.knex('upvotes').insert([
            { user_id: 3, comment_id: 1 },
            { user_id: 1, comment_id: 2 },
            { user_id: 2, comment_id: 3 },
            { user_id: 1, comment_id: 4 },
            { user_id: 3, comment_id: 4 },
            { user_id: 4, comment_id: 4 },
        ])
})

test.serial('It lists comments', async t => {
    const response = await request(app).get('/api/comments?userId=2')

    t.is(response.status, 200)
    t.true(response.body.success)
    t.is(response.body.comments.length, 2)
})

test.serial('It does not list comments without a userId', async t => {
    const response = await request(app).get('/api/comments')

    t.false(response.body.success)
    t.is(response.body.error, "User ID required for fetching comments")
})

test.serial('It allows submitting a new comment', async t => {
    const response = await request(app)
        .post('/api/comments')
        .send({
            userId: 1,
            text: 'Here is my new comment'
        })

    t.is(response.status, 200)
    t.true(response.body.success)
    t.is(response.body.id, 5)
})

test.serial('It allows submitting comments only with complete information', async t => {
    const response = await request(app)
        .post('/api/comments')
        .send({
            userId: 1,
        })

    t.is(response.status, 200)
    t.false(response.body.success)
    t.is(response.body.errors[0], 'text is a required field')
})

test.serial('It allows submitting a reply comment', async t => {
    const response = await request(app)
        .post('/api/comments')
        .send({
            userId: 1,
            parentId: 1,
            text: 'Here is my new reply'
        })

    t.is(response.status, 200)
    t.true(response.body.success)
    t.is(response.body.id, 6)

    const commentListResponse = await request(app).get('/api/comments?userId=2')

    t.is(commentListResponse.status, 200)
    t.is(commentListResponse.body.comments[0].replies.length, 3)
    t.is(commentListResponse.body.comments[0].replies[2].text, 'Here is my new reply')
})

test.serial('It allows submitting a reply only to existing comments', async t => {
    const response = await request(app)
        .post('/api/comments')
        .send({
            userId: 1,
            parentId: 999,
            text: 'Here is my new reply'
        })

    t.is(response.status, 200)
    t.false(response.body.success)
    t.is(response.body.errors[0], 'Comment does not exist')

    const commentListResponse = await request(app).get('/api/comments?userId=2')

    t.is(commentListResponse.status, 200)
    t.is(commentListResponse.body.comments[0].replies.length, 3)
})

test.serial('It allows submitting upvotes', async t => {
    const response = await request(app)
        .post('/api/comments/1/upvote')
        .send({
            userId: 4,
        })

    t.is(response.status, 200)
    t.true(response.body.success)
    t.is(response.body.upvoteCount, 2)

    const removeVoteResponse = await request(app)
        .post('/api/comments/1/upvote')
        .send({
            userId: 4,
        })

    t.is(removeVoteResponse.status, 200)
    t.true(removeVoteResponse.body.success)
    t.is(removeVoteResponse.body.upvoteCount, 1)
})

test.serial('It only allows existing users to vote', async t => {
    const response = await request(app)
        .post('/api/comments/1/upvote')
        .send({
            userId: 999,
        })

    t.is(response.status, 200)
    t.false(response.body.success)
    t.is(response.body.errors[0], 'User does not exist')
})
