function renderCommentsList(comments) {
    const container = document.getElementById('js-comments-container')
    const renderedComments = comments.map(renderComment)

    container.replaceChildren(...renderedComments)
}

function renderComment(comment) {
    const commentTemplate = document.getElementById('js-template-single-comment')
    const renderedComment = commentTemplate.content.cloneNode(true)

    const avatar = renderedComment.getElementById('js-comment-avatar')
    avatar.setAttribute('src', comment.user.avatar)
    avatar.setAttribute('alt', `Picture of ${comment.user.name}`)

    setElementText(renderedComment, 'js-comment-username', comment.user.name)
    setElementText(renderedComment, 'js-comment-timestamp', comment.createdAt)
    setElementText(renderedComment, 'js-comment-body', comment.text)
    setElementText(renderedComment, 'js-comment-upvotes', `(${comment.upvotes})`)

    return renderedComment
}

function setElementText(parent, id, text) {
    const element = parent.getElementById(id)
    element.innerText = text

    return element
}


function renderGenericError() {

}

(async () => {
    try {
        const res = await fetch('http://localhost:3000/api/comments')
        const comments = await res.json()

        renderCommentsList(comments)
    } catch (e) {
        renderGenericError()
    }
})()


