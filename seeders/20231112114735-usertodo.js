"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "UserTodos",
      [
        {
          user_id: 1,
          list_id: 1,
          access_type: "edit",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          user_id: 1,
          list_id: 2,
          access_type: "edit",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          user_id: 2,
          list_id: 2,
          access_type: "view",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("UserTodos", null, {});
  },
};
