import Backend from '../services.js'
import { html, renderErrorToast } from '../dom.js'
import { classnames } from '../utils.js'

const { useState } = React

export default function UpvoteCounter(props) {
    const [comment, setComment] = useState(props.comment)

    const handleUpvote = async () => {
        const res = await Backend.Comments.upvote(comment.id)

        if (!res.success) {
            renderErrorToast("The upvote couldn't be tracked. Please try again later")
            return
        }

        setComment({
            ...comment,
            currentUserHasVoted: !comment.currentUserHasVoted,
            upvotes: res.upvoteCount,
        })
    }

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
