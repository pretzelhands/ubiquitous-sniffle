import Backend from './services.js'
import {renderErrorToast, renderCommentsList, renderCommentForm} from './dom.js'
import { formToDictionary } from './utils.js'

export default class Events {
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

        const comment = Object.assign({}, res);
        delete comment.success;

        if (comment.parentId) {
            const otherComments = window.comments.filter(existingComment => comment.parentId !== existingComment.id)
            const parentComment = window.comments.find(existingComment => comment.parentId === existingComment.id)

            parentComment.replies = [comment, ...parentComment.replies]
            window.comments = [parentComment, ...otherComments].sort((a, b) =>  new Date(b.createdAt) - new Date(a.createdAt))

            renderCommentsList(window.comments)
            return
        }

        window.comments = [comment, ...window.comments]

        renderCommentsList(window.comments)
    }

    static handleReply(event) {
        const replyButton = event.target
        const replyContainer = event.target.parentElement.nextElementSibling

        const parentCommentId = replyButton.dataset.comment

        renderCommentForm(replyContainer, parentCommentId)
    }
}
