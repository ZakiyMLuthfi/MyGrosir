// src/reducers/stockActions.js

export const setStockIns = (stockIns) => ({
  type: "SET_STOCK_INS",
  payload: stockIns,
});

export const setStockOuts = (stockOuts) => ({
  type: "SET_STOCK_OUTS",
  payload: stockOuts,
});

export const setStockHistories = (stockHistories) => ({
  type: "SET_STOCK_HISTORIES",
  payload: stockHistories,
});

export const addStockIn = (stockIn) => ({
  type: "ADD_STOCK_IN",
  payload: stockIn,
});

export const addStockOut = (stockOut) => ({
  type: "ADD_STOCK_OUT",
  payload: stockOut,
});
