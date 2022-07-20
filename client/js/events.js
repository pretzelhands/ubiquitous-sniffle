import Backend from './services.js'
import { renderErrorToast, renderUpdatedVoteCount, renderCommentsList } from './dom.js'
import { formToDictionary } from './utils.js'

export default class Events {
    static async handleUpvote({ target }) {
        const res = await Backend.Comments.upvote(target.dataset.comment)

        if (!res.success) {
            renderErrorToast("The upvote couldn't be tracked. Please try again later")
            return
        }

        renderUpdatedVoteCount(target, res)
    }

    static async handleCommentSubmit(event) {
        event.preventDefault()

        const form = event.target;
        const data = formToDictionary(form)

        const textInput = form.querySelector('#js-form-comment-text')
        textInput.value = '';

        const res = await Backend.Comments.postComment(data)

        if (!res.success) {
            renderErrorToast("The comment couldn't be submitted. Please try again later")
            return
        }

        const comment = Object.assign({}, ...res);
        delete comment.success;

        window.comments = [comment, ...window.comments]

        renderCommentsList(window.comments)
    }
}
