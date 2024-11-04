"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Suppliers", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      supplier_code: {
        allowNull: false,
        type: Sequelize.STRING(5),
        unique: true,
      },
      supplier_name: {
        allowNull: false,
        type: Sequelize.STRING(32),
        unique: true,
      },
      supplier_address: {
        allowNull: false,
        type: Sequelize.STRING(64),
      },
      supplier_contact_name: {
        allowNull: false,
        type: Sequelize.STRING(32),
      },
      supplier_contact: {
        allowNull: false,
        type: Sequelize.STRING(15),
      },
      goods_type: {
        allowNull: false,
        type: Sequelize.ARRAY(Sequelize.STRING(10)),
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

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Suppliers");
  },
};
