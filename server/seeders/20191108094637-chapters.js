'use strict';

const faker = require('faker');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'chapters',
      [
        {
          name: faker.name.title(),
          description: faker.lorem.paragraph(),
          category: faker.lorem.word(),
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {},
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('chapters', null, {});
  },
};
