"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class StockOut extends Model {
    static associate(models) {
      StockOut.belongsTo(models.StockIn, {
        foreignKey: "stockInId",
        as: "stockIn",
      });
      StockOut.belongsTo(models.Supplier, {
        foreignKey: "supplierId",
        as: "supplier",
      });

      StockOut.belongsTo(models.Product, {
        foreignKey: "productId",
        as: "product",
      });
    }
  }
  StockOut.init(
    {
      stock_code: {
        type: DataTypes.STRING(6),
        allowNull: false,
      },
      stockInId: {
        type: DataTypes.INTEGER,
        references: {
          model: "StockIn",
          key: "id",
        },
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
      quantity_remaining: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      quantity_reduction: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      purchase_price: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
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
      updated_by: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "StockOut",
      tableName: "StockOuts",
      timestamps: true,
    }
  );
  return StockOut;
};
