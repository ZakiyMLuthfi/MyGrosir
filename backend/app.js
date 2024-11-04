require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;

const productRoutes = require("./routes/product");
const supplierRoutes = require("./routes/supplier");
const stockRoutes = require("./routes/stock");
const userRoutes = require("./routes/user");
const db = require("./models");

// Menggunakan Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

const userOptions = [
  { id: 1, title: "Profil", url: "/profil" },
  { id: 2, title: "Logout", url: "/logout" },
];
// Route untuk user & login
app.use("/api/users", userRoutes);

// Route untuk produk
app.use("/api/products", productRoutes);

// Route untuk supplier
app.use("/api/suppliers", supplierRoutes);

// Router untuk stock
app.use("/api/stocks", stockRoutes);

// Route untuk home
app.get("/", (req, res) => {
  res.send("MyGrosir backend mengucapkan Halo!");
});

// Endpoint API untuk dashboard
app.get("/api/dashboard", (req, res) => {
  res.send("Ini dashboard");
});

// Endpoint API untuk melapor error
app.get("/api/errors-report", (req, res) => {
  res.send("Ini halaman melapor error");
});

// Endpoint API untuk log
app.get("/api/logs", (req, res) => {
  res.send("Ini halaman error log");
});

// Endpoint untuk user options
app.get("/api/user-options", (req, res) => {
  res.json(userOptions);
});

app.use((req, res) => {
  res.status(404).send("Anda tersesat");
});

db.sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Database synchronized");
  })
  .catch((err) => {
    console.error("Error synchronizing database:", err);
  });

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

console.log(`App is running in ${process.env.NODE_ENV || "development"} mode.`);
