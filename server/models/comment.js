const db = require('../db')

module.exports = db.model('Comment', {
    tableName: 'comments',

    user() {
        return this.belongsTo('User')
    },

    upvotes() {
        return this.hasMany('Upvote')
    }
})
