(async () => {
    try {
        await setupUser()
        await setupComments()
    } catch (e) {
        renderGenericError()
    }
})()

async function setupUser() {
    const res = await fetch('http://localhost:3000/api/users/random')
    window.user = await res.json()

    // We set the avatar on the submission form so the user can
    // identify who they're posting as.
    const submitAvatar = document.getElementById('js-submit-avatar')
    submitAvatar.setAttribute('src', user.avatar)
}

async function setupComments() {
    const res = await fetch('http://localhost:3000/api/comments')
    const comments = await res.json()

    renderCommentsList(comments)
}

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
    const container = document.getElementById('js-comments-container')
    const errorTemplate = document.getElementById('js-template-error')
    const renderedError = errorTemplate.content.cloneNode(true)

    container.replaceChildren(renderedError)
}


