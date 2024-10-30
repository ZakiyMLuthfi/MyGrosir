// src/reducers/supplierActions.js

// Action untuk fetching data all
export const setSuppliers = (suppliers) => ({
  type: "SET_SUPPLIERS",
  payload: suppliers,
});

export const addSupplier = (supplier) => ({
  type: "ADD_SUPPLIER",
  payload: supplier,
});

export const removeSupplier = (id) => ({
  type: "REMOVE_SUPPLIER",
  payload: id,
});
