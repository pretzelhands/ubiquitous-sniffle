const yup = require('yup')

const commentSchema = yup.object().shape({
    text: yup.string().required(),
    userId: yup.number().required()
})

const upvoteSchema = yup.object().shape({
    userId: yup.number().required(),
    commentId: yup.number().required(),
})

module.exports = {
    commentSchema,
    upvoteSchema,
}
