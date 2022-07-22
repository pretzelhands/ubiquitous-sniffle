const { faker } = require('@faker-js/faker')

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  const people = [... new Array(4).keys()].map((index) => ({
    id: index + 1,
    name: faker.name.findName(),
    avatar: faker.image.avatar({ width: 128, height: 128 }),
  }))

  await knex('users').del()
  await knex('users').insert(people)
}
