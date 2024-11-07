// src/reducers/dashboardActions.js

export const setTotalAssets = (totalAssets) => ({
  type: "SET_TOTAL_ASSETS",
  payload: totalAssets,
});

export const setTotalItems = (totalItems) => ({
  type: "SET_TOTAL_ITEMS",
  payload: totalItems,
});

export const setTotalOutgoing = (totalOutgoing) => ({
  type: "SET_TOTAL_OUTGOING",
  payload: totalOutgoing,
});

export const setTotalIncoming = (totalIncoming) => ({
  type: "SET_TOTAL_INCOMING",
  payload: totalIncoming,
});

export const setStockFlowData = (stockFlowData) => ({
  type: "SET_STOCK_FLOW_DATA",
  payload: stockFlowData,
});

export const setRecentStockHistory = (recentStockHistory) => ({
  type: "SET_RECENT_STOCK_HISTORY",
  payload: recentStockHistory,
});

export const setLowStockNotifications = (lowStockNotifications) => ({
  type: "SET_LOW_STOCK_NOTIFICATIONS",
  payload: lowStockNotifications,
});
