// api.js
import axios from "axios";

export const fetchProducts = (page, itemsPerPage) => {
  return axios.get("http://localhost:5000/api/products", {
    params: { page, itemsPerPage },
  });
};

export const deleteProduct = (id) => {
  return axios.delete(`http://localhost:5000/api/products/${id}`);
};

export const addProduct = (product) => {
  return axios.post("http://localhost:5000/api/products", product);
};

export const updateProduct = (id, updatedProduct) => {
  return axios.put(`http://localhost:5000/api/products/${id}`, updatedProduct);
};
