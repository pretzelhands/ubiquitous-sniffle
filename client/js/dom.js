import htm from 'https://unpkg.com/htm?module'

import { setElementText } from './utils.js'

import UpvoteCounter from './components/UpvoteCounter.js'

const html = htm.bind(React.createElement)

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

    setElementText(renderedComment, 'js-comment-username', comment.user.name)
    setElementText(renderedComment, 'js-comment-timestamp', comment.createdAt)
    setElementText(renderedComment, 'js-comment-body', comment.text)

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

export {
    html,
    renderCommentsList,
    renderComment,
    renderUpdatedVoteCount,
    renderGenericError,
    renderErrorToast,
}
