const express = require("express");
const router = express.Router();
const { verifyToken, checkActiveStatus } = require("../middlewares/userVerify");

const stockInAll = require("../controllers/stocks/stockInAll");
const stockInAdd = require("../controllers/stocks/stockAdd");
const stockInDetail = require("../controllers/stocks/stockInDetail");
const stockOutAll = require("../controllers/stocks/stockOutAll");
const stockOutDetail = require("../controllers/stocks/stockOutDetail");
const stockOutUpdate = require("../controllers/stocks/stockOutUpdate");
const stockHistoryAll = require("../controllers/stocks/stockHistoryAll");
const stockHistoryDetail = require("../controllers/stocks/stockHistoryDetail");
const batchReduce = require("../controllers/stocks/stockOutBatchReduce");
const getReceiptCodes = require("../controllers/stocks/getReceiptCode");

router.get("/stock-in", verifyToken, stockInAll);
router.post("/stock-in", verifyToken, checkActiveStatus, stockInAdd);
router.get("/stock-in/:id", verifyToken, stockInDetail);
router.get("/stock-out", verifyToken, stockOutAll);
router.get("/stock-out/:id", verifyToken, stockOutDetail);
router.put("/stock-out/:id", verifyToken, checkActiveStatus, stockOutUpdate);
router.post("/batch-reduce", verifyToken, batchReduce);
router.get("/stock-history", verifyToken, stockHistoryAll);
router.get("/stock-history/:id", verifyToken, stockHistoryDetail);
router.get("/receipt-codes", verifyToken, getReceiptCodes);

module.exports = router;
