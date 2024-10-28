const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;

const productRoutes = require("./routes/product");
const supplierRoutes = require("./routes/supplier");
const stockRoutes = require("./routes/stock");
const db = require("./models");

const userOptions = [
  { id: 1, title: "Profil", url: "/profil" },
  { id: 2, title: "Logout", url: "/logout" },
];

// Menggunakan Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

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

// Endpoint API untuk CRUD supplier

// Endpoint API untuk orang
app.get("/api/user", (req, res) => {
  res.send("Ini halaman orang");
});

// Endpoint API untuk laporan
app.get("/api/reports", (req, res) => {
  res.send("Ini halaman laporan data");
});

// Endpoint API untuk melapor error
app.get("/api/error-report", (req, res) => {
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
