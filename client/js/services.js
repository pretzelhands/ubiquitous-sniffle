const BASE_URL = 'http://localhost:3000'

class CommentsService {
    async fetchAll() {
        // The userId is being sent here since we have no actual auth mechanism to determine
        // user server-side, and I need that information to show whether a user has already
        // voted on a comment.

        const res = await fetch(`${BASE_URL}/api/comments?userId=${window.user.id}`)
        window.comments = await res.json()

        return comments
    }

    async upvote(id) {
        const res = await sendPostRequest(
            `${BASE_URL}/api/comments/${id}/upvote`,
            {
                userId: window.user.id
            }
        )

        return await res.json()
    }

    async postComment(data) {
        const res = await sendPostRequest(
            `${BASE_URL}/api/comments`,
            {
                userId: window.user.id,
                text: data.text
            }
        )

        return await res.json()
    }
}

class AuthService {
    async fetchRandomUser() {
        const res = await fetch(`${BASE_URL}/api/users/random`)
        window.user = await res.json()

        return user
    }
}

const Backend = {
    Comments: new CommentsService(),
    Auth: new AuthService()
}
