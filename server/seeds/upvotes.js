const { randomIntInRange } = require('../utils')

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  const upvotes = [... new Array(100).keys()].map((index) => ({
    id: index + 1,
    user_id: randomIntInRange(1, 10),
    comment_id: randomIntInRange(1, 10),
  }))

  await knex('upvotes').del()
  await knex('upvotes').insert(upvotes)
}
