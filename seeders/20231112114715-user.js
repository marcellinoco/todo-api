"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Users", [
      {
        username: "marcel",
        password:
          "$2b$10$pzrURMneuUdz.WQnW7cdA.zlDpPog7kaLLWQSR8SK2WelCBu0/fGO", // marcel@123
        email: "marcel@gmail.com",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: "chris",
        password:
          "$2b$10$uEBEoeizl9EamxvnB6fqtuBYvmEyondzvAtkRt5KL0srliqcsQHby", // chris@123
        email: "chris@gmail.com",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null);
  },
};
