import htm from './lib/htm.js'

import { dateToRelativeTime, setElementText } from './utils.js'

import UpvoteCounter from './components/UpvoteCounter.js'

const html = htm.bind(React.createElement)

function renderCommentForm(container, parentId = null) {
    const formTemplate = document.getElementById('js-template-comment-form')
    const renderedForm = formTemplate.content.cloneNode(true)

    const submitAvatar = renderedForm.getElementById('js-submit-avatar')
    submitAvatar.setAttribute('src', user.avatar)

    if (parentId) {
        const parentIdInput = document.createElement('input')
        parentIdInput.name = 'parentId'
        parentIdInput.type = 'hidden'
        parentIdInput.value = parentId

        renderedForm
            .querySelector('form')
            .appendChild(parentIdInput)

        container.classList.remove('hidden')
    }

    container.replaceChildren(renderedForm)
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
    const reactRoot = ReactDOM.createRoot(upvoteButton)
    reactRoot.render(html`<${UpvoteCounter} comment=${comment} />`)

    const replyButton = renderedComment.getElementById('js-comment-reply-button')
    if (!comment.parentId) {
        replyButton.dataset.comment = comment.id
    } else {
        // We only support one level of nesting
        replyButton.remove()
    }

    setElementText(renderedComment, 'js-comment-username', comment.user.name)
    setElementText(renderedComment, 'js-comment-timestamp', dateToRelativeTime(comment.createdAt))
    setElementText(renderedComment, 'js-comment-body', comment.text)

    if (comment.replies && comment.replies.length) {
        const replies = comment.replies.map(renderComment)

        const repliesContainer = renderedComment.getElementById('js-comment-replies')
        repliesContainer.classList.add('mt-8')
        repliesContainer.replaceChildren(...replies)

        const repliesIndicator = renderedComment.getElementById('js-comment-replies-indicator')
        repliesIndicator.classList.remove('hidden')
    }

    return renderedComment
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

export {
    html,
    renderCommentForm,
    renderCommentsList,
    renderComment,
    renderGenericError,
    renderErrorToast,
}
