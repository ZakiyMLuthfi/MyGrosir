// src/reducers/actions/productActions.js
export const setProducts = (products) => ({
  type: "SET_PRODUCTS",
  payload: products,
});

export const addProduct = (product) => ({
  type: "ADD_PRODUCT",
  payload: product,
});

export const removeProduct = (id) => ({
  type: "REMOVE_PRODUCT",
  payload: id,
});
