"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      Product.hasMany(models.StockIn, {
        foreignKey: "productId",
        as: "stockIns",
      });
      Product.hasMany(models.StockOut, {
        foreignKey: "productId",
        as: "stockOuts",
      });
      Product.belongsTo(models.User, {
        foreignKey: "created_by",
        as: "Creator",
      });
      Product.belongsTo(models.User, {
        foreignKey: "updated_by",
        as: "Updater",
      });
    }
  }
  Product.init(
    {
      product_code: {
        type: DataTypes.STRING(5),
        allowNull: false,
        unique: true,
      },
      product_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      package_quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      weight: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      weight_type: {
        type: DataTypes.ENUM("kilogram", "gram", "liter", "ml"),
        allowNull: false,
      },
      weight_per_pkg: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      isDeleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      created_by: {
        type: DataTypes.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
        allowNull: false,
      },
      updated_by: {
        type: DataTypes.INTEGER,
        references: {
          model: "Users", // Nama tabel yang dirujuk
          key: "id",
        },
        allowNull: false, // Biarkan bisa null jika diperlukan
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
      modelName: "Product",
      tableName: "Products",
      timestamps: true,
      hooks: {
        beforeCreate: async (product) => {
          const lastProduct = await Product.findOne({
            order: [["createdAt", "DESC"]],
          });

          if (!lastProduct) {
            // Jika tidak ada produk, buat kode produk awalan
            product.product_code = "P0001";
          } else {
            const lastCode = lastProduct.product_code;
            const numberPart = parseInt(lastCode.substring(1), 10);
            product.product_code = `P${(numberPart + 1)
              .toString()
              .padStart(4, "0")}`;
            console.log(`setting product_code to ${product.product_code}`);
          }
        },
      },
    }
  );
  return Product;
};
