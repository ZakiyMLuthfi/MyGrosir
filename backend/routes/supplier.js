const express = require("express");
const router = express.Router();

const {
  verifyToken,
  checkActiveStatus,
  authorizeSuperAdmin,
} = require("../middlewares/userVerify");

const supplierAll = require("../controllers/suppliers/supplierAll");
const supplierAdd = require("../controllers/suppliers/supplierAdd");
const supplierDetail = require("../controllers/suppliers/supplierDetail");
const supplierUpdate = require("../controllers/suppliers/supplierUpdate");
const {
  supplierDelete,
  supplierRestore,
} = require("../controllers/suppliers/supplierDelete");

// Endpoint API untuk CRUD supplier
router.get("/", verifyToken, supplierAll);
router.post("/", verifyToken, checkActiveStatus, supplierAdd);
router.get("/:id", verifyToken, supplierDetail);
router.put("/:id", verifyToken, checkActiveStatus, supplierUpdate);
router.delete("/:id", verifyToken, checkActiveStatus, supplierDelete);
router.put("/:id/restore", verifyToken, checkActiveStatus, supplierRestore);

module.exports = router;
