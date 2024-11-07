const express = require("express");
const router = express.Router();
const {
  getTotalAssets,
  getTotalWarehouseItems,
  getTotalOutgoingItems,
  getTotalIncomingItems,
  getStockFlow,
  getRecentStockHistory,
  getLowStockNotifications,
} = require("../controllers/dashboards/totalStocks");

router.get("/total-assets", getTotalAssets);
router.get("/total-warehouse-items", getTotalWarehouseItems);
router.get("/total-outgoing-items", getTotalOutgoingItems);
router.get("/total-incoming-items", getTotalIncomingItems);
router.get("/stock-flow", getStockFlow);
router.get("/recent-stock-history", getRecentStockHistory);
router.get("/low-stock-notifications", getLowStockNotifications);

module.exports = router;
