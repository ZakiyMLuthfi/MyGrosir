const express = require("express");
const router = express.Router();
const {
  getTotalAssets,
  getTotalWarehouseItems,
  getTotalOutgoingItems,
  getStockFlow,
} = require("../controllers/dashboards/totalStocks");

router.get("/total-assets", getTotalAssets);
router.get("/total-warehouse-items", getTotalWarehouseItems);
router.get("/total-outgoing-items", getTotalOutgoingItems);
router.get("/stock-flow", getStockFlow);

module.exports = router;
