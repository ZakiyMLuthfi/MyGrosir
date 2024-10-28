const express = require("express");
const router = express.Router();

const supplierAll = require("../controllers/suppliers/supplierAll");
const supplierAdd = require("../controllers/suppliers/supplierAdd");
const supplierDetail = require("../controllers/suppliers/supplierDetail");
const supplierUpdate = require("../controllers/suppliers/supplierUpdate");
const {
  supplierDelete,
  supplierRestore,
} = require("../controllers/suppliers/supplierDelete");

// Endpoint API untuk CRUD supplier
router.get("/", supplierAll);
router.post("/", supplierAdd);
router.get("/:id", supplierDetail);
router.put("/:id", supplierUpdate);
router.delete("/:id", supplierDelete);
router.put("/:id/restore", supplierRestore);

module.exports = router;
