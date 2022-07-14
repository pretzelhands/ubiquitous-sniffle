const db = require('../db')

module.exports = db.model('User', {
    tableName: 'users'
})
