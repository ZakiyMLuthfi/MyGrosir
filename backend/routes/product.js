const express = require("express");
const router = express.Router();
const {
  verifyToken,
  checkActiveStatus,
  authorizeSuperAdmin,
} = require("../middlewares/userVerify");

const productAll = require("../controllers/products/productAll");
const productAdd = require("../controllers/products/productAdd");
const productDetail = require("../controllers/products/productDetail");
const productUpdate = require("../controllers/products/productUpdate");
const {
  productDelete,
  productRestore,
} = require("../controllers/products/productDelete");

// Endpoint API untuk CRUD produk
router.get("/", verifyToken, productAll);
router.post("/", verifyToken, checkActiveStatus, productAdd);
router.get("/:id", verifyToken, productDetail);
router.put("/:id", verifyToken, checkActiveStatus, productUpdate);
router.delete("/:id", verifyToken, checkActiveStatus, productDelete);
router.put("/:id/restore", verifyToken, checkActiveStatus, productRestore);

module.exports = router;
