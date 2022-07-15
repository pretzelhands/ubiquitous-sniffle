const db = require('../db')

module.exports = db.model('Upvote', {
    tableName: 'upvotes',

    comment() {
        return this.belongsTo('Comment')
    }
})
