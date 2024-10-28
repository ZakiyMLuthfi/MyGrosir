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
      // setelah submit data pada tabel stockIn, maka data takkan bisa diubah lagi selain quantity_remaining yang berkurang lewat stockOut
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      grosir_choice: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "Grosir A",
      },
      created_by: {
        type: Sequelize.STRING(20),
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
