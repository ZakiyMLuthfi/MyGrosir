"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class StockHistory extends Model {
    static associate(models) {
      StockHistory.belongsTo(models.StockOut, {
        foreignKey: "stockOutId",
        as: "stockOuts",
      });

      StockHistory.belongsTo(models.Supplier, {
        foreignKey: "supplierId",
        as: "supplier",
      });

      StockHistory.belongsTo(models.Product, {
        foreignKey: "productId",
        as: "product",
      });
      StockHistory.belongsTo(models.User, {
        foreignKey: "created_by",
        as: "Creator",
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
      stockOutId: {
        type: DataTypes.INTEGER,
        references: {
          model: "StockOuts",
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
        type: DataTypes.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
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
      timestamps: false,
    }
  );
  return StockHistory;
};
