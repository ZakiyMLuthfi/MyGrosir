"use strict";
const bcrypt = require("bcrypt");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Enkripsi password sebelum memasukkan ke dalam tabel
    const hashSuper = await bcrypt.hash("Super123", 10);
    const hashAdmin = await bcrypt.hash("Admin123", 10);
    return queryInterface.bulkInsert(
      "Users",
      [
        {
          username: "super@mygrosir.com",
          email: "zakiymluthfi@gmail.com",
          password: hashSuper,
          role: "superadmin",
          is_active: false,
          created_by: 1,
          updated_by: 1,
          is_deleted: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          username: "admin@mygrosir.com",
          email: "admindummy@gmail.com",
          password: hashAdmin,
          role: "admin",
          is_active: false,
          created_by: 1,
          updated_by: 1,
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
      { username: "proadmin@mygrosir.com" },
      {}
    );
  },
};
