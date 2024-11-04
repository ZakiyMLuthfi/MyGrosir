"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("StockOuts", {
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
      stockInId: {
        type: Sequelize.INTEGER,
        references: {
          model: "StockIns",
          key: "id",
        },
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
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      quantity_remaining: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      quantity_reduction: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      purchase_price: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
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

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("StockOuts");
  },
};
