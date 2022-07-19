const db = require('../db')

module.exports = db.model('Upvote', {
    tableName: 'upvotes',
    requireFetch: false,

    comment() {
        return this.belongsTo('Comment')
    }
})
