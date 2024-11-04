"use strict";

module.exports = {
  // Fungsi untuk menerapkan migrasi (membuat tabel)
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Products", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      product_code: {
        type: Sequelize.STRING(5),
        allowNull: false,
        unique: true,
      },
      product_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      package_quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          max: 100,
        },
      },
      weight: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      weight_type: {
        type: Sequelize.ENUM("kilogram", "gram", "liter", "ml"),
        allowNull: false,
      },
      weight_per_pkg: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
        validate: {
          max: 999.99,
        },
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      isDeleted: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      created_by: {
        type: Sequelize.INTEGER,
        references: {
          model: "Users", // Mengacu pada tabel Users
          key: "id",
        },
        allowNull: false,
      },
      updated_by: {
        type: Sequelize.INTEGER,
        references: {
          model: "Users", // Mengacu pada tabel Users
          key: "id",
        },
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now"),
      },
    });
  },

  // Fungsi untuk membatalkan migrasi (menghapus tabel)
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Products");
  },
};
