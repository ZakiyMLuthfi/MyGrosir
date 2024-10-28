"use strict";
const { Model } = require("sequelize");
const { Sequelize } = require(".");

module.exports = (sequelize, DataTypes) => {
  class StockHistory extends Model {
    static associate(models) {
      StockHistory.belongsTo(models.StockOut, {
        foreignKey: "stockOutId",
        as: "stockOut",
      });
    }
  }
  StockHistory.init(
    {
      stock_code: {
        type: DataTypes.STRING(6),
        allowNull: false,
      },
      supplierId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Suppliers",
          key: "id",
        },
        allowNull: false,
      },
      productId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Products",
          key: "id",
        },
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      stock_price: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
      },
      grosir_choice: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "Grosir A",
      },
      created_by: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "StockHistory",
      tableName: "StockHistory",
    }
  );
  return StockHistory;
};
