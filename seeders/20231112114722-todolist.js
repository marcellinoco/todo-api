"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("TodoLists", [
      {
        title: "Daily Tasks",
        description: "Marcel's daily task list",
        owner_id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "School Project",
        description: "Software engineering course task list",
        owner_id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("TodoLists", null);
  },
};
