"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Supplier extends Model {
    static associate(models) {
      Supplier.hasMany(models.StockIn, {
        foreignKey: "supplierId",
        as: "stockIns",
      });
      Supplier.hasMany(models.StockOut, {
        foreignKey: "supplierId",
        as: "stockOuts",
      });
    }
  }
  Supplier.init(
    {
      supplier_code: {
        allowNull: false,
        type: DataTypes.STRING(6),
        unique: true,
      },
      supplier_name: {
        allowNull: false,
        type: DataTypes.STRING(32),
        unique: true,
      },
      supplier_address: {
        allowNull: false,
        type: DataTypes.STRING(64),
      },
      supplier_contact_name: {
        allowNull: false,
        type: DataTypes.STRING(32),
      },
      supplier_contact: {
        allowNull: false,
        type: DataTypes.STRING(15),
        validate: {
          isNumeric: true,
        },
      },
      goods_type: {
        allowNull: false,
        type: DataTypes.ARRAY(DataTypes.STRING(10)),
      },
      isDeleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      created_by: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      updated_by: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Supplier",
      tablename: "Suppliers",
      timestamps: true,
      hooks: {
        beforeCreate: async (supplier) => {
          const lastSupplier = await Supplier.findOne({
            order: [["createdAt", "DESC"]],
          });

          if (!lastSupplier) {
            supplier.supplier_code = "Sp0001";
          } else {
            const lastCode = lastSupplier.supplier_code;
            const numberPart = parseInt(lastCode.substring(2), 10);
            supplier.supplier_code = `Sp${(numberPart + 1)
              .toString()
              .padStart(4, "0")}`;
            console.log(`setting supplier_code to ${supplier.supplier_code}`);
          }
        },
      },
    }
  );
  return Supplier;
};
