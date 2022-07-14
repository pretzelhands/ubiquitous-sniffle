const db = require('../db')

module.exports = db.model('Comment', {
    tableName: 'comments'
})
