"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("StockHistory", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      stock_code: {
        type: Sequelize.STRING(6),
        allowNull: false,
      },
      supplierId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Suppliers",
          key: "id",
        },
        allowNull: false,
      },
      productId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Products",
          key: "id",
        },
        allowNull: false,
      },
      stockOutId: {
        type: Sequelize.INTEGER,
        references: {
          model: "StockOuts",
          key: "id",
        },
        allowNull: false,
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      stock_price: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
      },
      grosir_choice: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "Grosir A",
      },
      created_by: {
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
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("StockHistory");
  },
};
