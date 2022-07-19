const db = require('../db')

module.exports = db.model('User', {
    tableName: 'users',
    requireFetch: false,

    comments() {
        return this.hasMany('Comment')
    }
})
