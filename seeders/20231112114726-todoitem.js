"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("TodoItems", [
      {
        content: "Buy groceries",
        is_completed: true,
        due_date: new Date(),
        list_id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        content: "Finish homework",
        is_completed: false,
        due_date: new Date(),
        list_id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("TodoItems", null);
  },
};
