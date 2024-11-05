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

export const setStockFlowData = (stockFlowData) => ({
  type: "SET_STOCK_FLOW_DATA",
  payload: stockFlowData,
});
