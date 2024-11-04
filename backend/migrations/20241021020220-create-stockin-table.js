"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("StockIns", {
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
      // Jumlah yang tersisa (berkurang seiring pengurangan data pada stockOut)
      quantity_remaining: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      // Mengambil harga jual di tabel Product kemudian mengalikannya quantity
      purchase_price: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
      },
      total_purchase_price: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
      },
      created_by: {
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
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
    await queryInterface.dropTable("StockIns");
  },
};
