const db = require('../db')

module.exports = db.model('Upvote', {
    tableName: 'upvotes'
})
