const { faker } = require('@faker-js/faker')
const { randomIntInRange } = require('../utils')

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  const comments = [... new Array(10).keys()].map((index) => ({
    id: index + 1,
    user_id: randomIntInRange(1, 10),
    text: faker.lorem.sentences(),
  }))

  await knex('comments').del()
  await knex('comments').insert(comments)
}
