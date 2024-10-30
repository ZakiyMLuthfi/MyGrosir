// src/services/productService.js
import axios from "axios";
import {
  addProduct,
  setProducts,
  removeProduct,
} from "../reducers/productActions";

const API_URL = "http://localhost:5000/api/products";

export const fetchProducts = async (
  currentPage,
  itemsPerPage,
  dispatch,
  searchTerm
) => {
  try {
    const response = await axios.get(API_URL, {
      params: {
        page: currentPage,
        itemsPerPage,
        sort: "updatedAt",
        search: searchTerm,
      },
    });
    dispatch(setProducts(response.data.products));
    return response.data.totalPages;
  } catch (err) {
    console.error("Error fetching products", err);
    throw err;
  }
};

export const addProductService = async (formData, dispatch) => {
  try {
    const formDataWithUserId = {
      ...formData,
      created_by: "ultraadmin",
      updated_by: "ultraadmin",
    };

    const response = await axios.post(`${API_URL}`, formDataWithUserId);

    if (response.data.product) {
      dispatch(addProduct(response.data.product));
      console.log("Product added succesfully:", response.data.product);
    } else {
      console.error("Product not found in respons");
    }
  } catch (error) {
    console.error("Error adding product", error);
    throw error;
  }
};

export const deleteProductService = async (id, dispatch) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    console.log("Product deleted: ", response.data);
    dispatch(removeProduct(id));
    return response.data;
  } catch (err) {
    console.error("Error deleting product:", err);
    throw err;
  }
};

export const restoreProductService = async (id) => {
  try {
    const response = await axios.put(`${API_URL}/${id}/restore`);
    console.log("Product restored: ", response.data);
    return response.data;
  } catch (err) {
    console.error("Error restoring product: ", err);
    throw err;
  }
};

export const fetchProductDetail = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product detail", error);
    throw error;
  }
};

export const updateProduct = async (id, updatedData) => {
  try {
    await axios.put(`${API_URL}/${id}`, updatedData);
  } catch (error) {
    console.error("Error updating product", error);
    throw error;
  }
};
