const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // Association to track creator (superadmin)
      this.belongsTo(models.User, {
        foreignKey: "created_by",
        as: "creator",
      });
      this.belongsTo(models.User, {
        foreignKey: "updated_by",
        as: "updater",
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
      username: {
        type: DataTypes.STRING(25),
        allowNull: false,
        unique: true,
        validate: {
          len: {
            args: [1, 20],
            msg: "Username cannot more than 20 character",
          },
          is: {
            args: /^[a-zA-Z0-9._%+-]+@mygrosir\.com$/,
            msg: "Username must in company email format (name@mygrosir.com)",
          },
        },
      },
      password: {
        type: DataTypes.STRING(12),
        allowNull: false,
        validate: {
          len: {
            args: [8, 12], // Minimal 8, maksimal 12 karakter
            msg: "Password must 8 to 12 character",
          },
          is: {
            args: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,12}$/,
            msg: "Password must include a capital word, small, and number",
          },
        },
      },
      reset_password_token: {
        type: DataTypes.STRING(12),
        allowNull: true,
        validate: {
          len: {
            args: [12, 12],
            msg: "Token reset password harus 12 karakter",
          },
        },
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
