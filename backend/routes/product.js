const express = require("express");
const router = express.Router();

const productAll = require("../controllers/products/productAll");
const productAdd = require("../controllers/products/productAdd");
const productDetail = require("../controllers/products/productDetail");
const productUpdate = require("../controllers/products/productUpdate");
const {
  productDelete,
  productRestore,
} = require("../controllers/products/productDelete");

// Endpoint API untuk CRUD produk
router.get("/", productAll);
router.post("/", productAdd);
router.get("/:id", productDetail);
router.put("/:id", productUpdate);
router.delete("/:id", productDelete);
router.put("/:id/restore", productRestore);

module.exports = router;
