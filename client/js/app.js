(async () => {
    try {
        await setupUser()
        await setupComments()

        addDynamicEventHandler(
            'js-comment-form',
            'submit',
            Events.handleCommentSubmit
        )
    } catch (e) {
        renderGenericError()
    }
})()

async function setupUser() {
    const user = await Backend.Auth.fetchRandomUser()

    // We set the avatar on the submission form so the user can
    // identify who they're posting as.
    const submitAvatar = document.getElementById('js-submit-avatar')
    submitAvatar.setAttribute('src', user.avatar)
}

async function setupComments() {
    const comments = await Backend.Comments.fetchAll()

    renderCommentsList(comments)
    addDynamicEventHandler(
        'js-comment-upvote-button',
        'click',
        Events.handleUpvote
    )
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

    const upvoteButton = renderedComment.getElementById('js-comment-upvote-button')
    upvoteButton.dataset.comment = comment.id

    if (comment.currentUserHasVoted) {
        upvoteButton.classList.add('text-purple-ghost')
    }

    setElementText(renderedComment, 'js-comment-username', comment.user.name)
    setElementText(renderedComment, 'js-comment-timestamp', comment.createdAt)
    setElementText(renderedComment, 'js-comment-body', comment.text)
    setElementText(renderedComment, 'js-comment-upvotes', `(${comment.upvotes})`)

    return renderedComment
}

function renderUpdatedVoteCount(upvoteTarget, data) {
    upvoteTarget.classList.toggle('text-purple-ghost')

    setElementText(upvoteTarget, 'js-comment-upvotes', `(${data.upvoteCount})`)
}

function renderGenericError() {
    const container = document.getElementById('js-comments-container')
    const errorTemplate = document.getElementById('js-template-error')
    const renderedError = errorTemplate.content.cloneNode(true)

    container.replaceChildren(renderedError)
}

function renderErrorToast(text) {
    const toast = document.getElementById('js-toast')
    toast.innerText = text
    toast.classList.remove('opacity-0')

    setTimeout(() => toast.classList.add('opacity-0'), 2000)
}

