"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "Users",
      [
        {
          username: "ultraadmin",
          email: "superadmin@mygrosir.com",
          password: "super123",
          role: "superadmin",
          is_active: true,
          created_by: 1, // Superadmin membuat dirinya sendiri pada id pertama
          is_deleted: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete(
      "Users",
      { username: "superadmin@mygrosir.com" },
      {}
    );
  },
};
