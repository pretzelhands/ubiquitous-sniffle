import Backend from '../services.js'
import { html, renderErrorToast } from '../dom.js'
import { classnames } from '../utils.js'

const { useState, useEffect } = React

export default function UpvoteCounter(props) {
    const [comment, setComment] = useState(props.comment)

    const handleRealtimeUpdate = ({ data }) => {
        const res = JSON.parse(data)

        if (res.commentId !== comment.id) {
            return
        }

        setComment(oldComment => {
            let newComment = Object.assign({}, oldComment)
            newComment.upvotes = res.upvoteCount

            if (res.userId === window.user.id) {
                newComment.currentUserHasVoted = !oldComment.currentUserHasVoted
            }

            return newComment
        })
    }

    const handleUpvote = async () => {
        const res = await Backend.Comments.upvote(comment.id)

        if (!res.success) {
            renderErrorToast("The upvote couldn't be tracked. Please try again later")
            return
        }
    }

    useEffect(() => {
        window.ws.addEventListener('message', handleRealtimeUpdate)
    }, [])


    return html`<div
        onClick=${handleUpvote}
        className=${classnames({
            'inline-flex items-center hover:text-purple-ghost cursor-pointer': true,
            'text-purple-ghost': comment.currentUserHasVoted,
        })}
    >
        <span className="text-[8px] mr-1">\u25b2</span>
        Upvote 
        <span className="ml-[2px]">(${comment.upvotes})</span>
    </div>`
}
