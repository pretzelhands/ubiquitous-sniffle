import Events from './events.js'
import Backend from './services.js'
import { renderGenericError, renderCommentsList } from './dom.js'
import { addDynamicEventHandler, setElementText } from './utils.js'

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
        console.warn(e)
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

