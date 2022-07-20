import { html } from '../dom.js'

export default function UpvoteCounter({ comment }) {
    return html`<div
        class="inline-flex items-center hover:text-purple-ghost cursor-pointer"
    >
        <span className="text-[8px] mr-1">\u25b2</span>
        Upvote 
        <span className="ml-[2px]">(${comment.upvotes})</span>
    </div>`
}
