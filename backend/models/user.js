const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Product, {
        foreignKey: "created_by",
        as: "CreatedProducts",
      });
      User.hasMany(models.Product, {
        foreignKey: "updated_by",
        as: "UpdatedProducts",
      });
      User.hasMany(models.Supplier, {
        foreignKey: "created_by",
        as: "CreatedSuppliers",
      });
      User.hasMany(models.Supplier, {
        foreignKey: "updated_by",
        as: "UpdatedSuppliers",
      });
      User.hasMany(models.StockIn, {
        foreignKey: "created_by",
        as: "CreatedStockIns",
      });
      User.hasMany(models.StockOut, {
        foreignKey: "created_by",
        as: "CreatedStockOuts",
      });
      User.hasMany(models.StockOut, {
        foreignKey: "updated_by",
        as: "UpdatedStockOuts",
      });
      User.hasMany(models.StockHistory, {
        foreignKey: "created_by",
        as: "CreatedStockHistory",
      });
    }
  }

  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      email: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: {
            msg: "Email format is invalid",
          },
          len: {
            args: [1, 50],
            msg: "Email length must be under 50 characters",
          },
        },
      },
      username: {
        type: DataTypes.STRING(25),
        allowNull: false,
        unique: true,
        validate: {
          len: {
            args: [1, 25],
            msg: "Username cannot exceed 25 character before '@mygrosir.com'",
          },
        },
      },
      password: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      reset_password_token: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      reset_password_expires: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      role: {
        type: DataTypes.ENUM("admin", "supervisor", "superadmin"),
        allowNull: false,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      created_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      updated_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "Users",
      timestamps: false, // Mengelola created_at dan updated_at secara manual
    }
  );

  return User;
};
