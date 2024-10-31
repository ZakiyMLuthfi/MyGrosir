"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const db = {};
const config = require("../config/config.js")[
  process.env.NODE_ENV || "development"
]; // Mengambil konfigurasi sesuai environment

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
    logging: false,
  }
);

// Membaca dan mendaftarkan semua model
fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js" &&
      file.indexOf(".test.js") === -1
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    ); // Memanggil model dengan sequelize
    db[model.name] = model;
  });

// Menjalankan asosiasi (jika ada) pada model yang terdaftar
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Ekspor instance sequelize dan semua model
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
