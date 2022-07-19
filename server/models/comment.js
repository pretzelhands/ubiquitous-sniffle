const db = require('../db')

module.exports = db.model('Comment', {
    tableName: 'comments',
    requireFetch: false,

    user() {
        return this.belongsTo('User')
    },

    upvotes() {
        return this.hasMany('Upvote')
    }
})
