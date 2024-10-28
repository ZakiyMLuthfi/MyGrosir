"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class StockIn extends Model {
    static associate(models) {
      StockIn.belongsTo(models.Supplier, {
        foreignKey: "supplierId",
        as: "supplier",
      });

      StockIn.belongsTo(models.Product, {
        foreignKey: "productId",
        as: "product",
      });
    }
  }
  StockIn.init(
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
      quantity_remaining: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      purchase_price: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
      },
      total_purchase_price: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: true,
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
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "StockIn",
      tableName: "StockIns",
      timestamps: true,
      hooks: {
        beforeCreate: async (stockIn) => {
          const lastStockIn = await StockIn.findOne({
            order: [["createdAt", "DESC"]],
          });

          if (!lastStockIn) {
            // Jika tidak ada stock terakhir, buat code pertama
            stockIn.stock_code = "S0001";
          } else {
            const lastCode = lastStockIn.stock_code;
            const numberPart = parseInt(lastCode.substring(1), 10);
            stockIn.stock_code = `S${(numberPart + 1)
              .toString()
              .padStart(4, "0")}`;
            console.log(`setting transaction code to ${stockIn.stock_code}`);
          }
        },
      },
    }
  );
  return StockIn;
};
