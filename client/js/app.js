import Events from './events.js'
import Backend from './services.js'
import { renderGenericError, renderCommentsList, renderCommentForm } from './dom.js'
import { addDynamicEventHandler } from './utils.js'

(async () => {
    try {
        await setupUser()
        await setupComments()
    } catch (e) {
        console.warn(e)
        renderGenericError()
    }
})()

async function setupUser() {
    await Backend.Auth.fetchRandomUser()
}

async function setupComments() {
    const { comments } = await Backend.Comments.fetchAll()

    renderCommentForm(document.getElementById('js-comment-form-container'))
    addDynamicEventHandler(
        'js-comment-form',
        'submit',
        Events.handleCommentSubmit
    )

    renderCommentsList(comments)
    addDynamicEventHandler(
        'js-comment-reply-button',
        'click',
        Events.handleReply
    )
}

