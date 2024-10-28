const express = require("express");
const router = express.Router();

const stockInAll = require("../controllers/stocks/stockInAll");
const stockInAdd = require("../controllers/stocks/stockAdd");
const stockInDetail = require("../controllers/stocks/stockInDetail");
const stockOutAll = require("../controllers/stocks/stockOutAll");
const stockOutDetail = require("../controllers/stocks/stockOutDetail");
const stockOutUpdate = require("../controllers/stocks/stockOutUpdate");
const stockHistoryAll = require("../controllers/stocks/stockHistoryAll");
const stockHistoryDetail = require("../controllers/stocks/stockHistoryDetail");

router.get("/stock-in", stockInAll);
router.post("/stock-in", stockInAdd);
router.get("/stock-in/:id", stockInDetail);
router.get("/stock-out", stockOutAll);
router.get("/stock-out/:id", stockOutDetail);
router.put("/stock-out/:id", stockOutUpdate);
router.get("/stock-history", stockHistoryAll);
router.get("/stock-history/:id", stockHistoryDetail);

module.exports = router;
