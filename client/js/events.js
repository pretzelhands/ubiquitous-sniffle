class Events {
    static async handleUpvote({ target }) {
        const res = await Backend.Comments.upvote(target.dataset.comment)
        renderUpdatedVoteCount(target, res)
    }

    static async handleCommentSubmit(event) {
        event.preventDefault()

        const form = event.target;
        const data = formToDictionary(form)

        const textInput = form.querySelector('#js-form-comment-text')
        textInput.value = '';

        const comment = await Backend.Comments.postComment(data)
        window.comments = [comment, ...window.comments]

        renderCommentsList(window.comments)
    }
}
