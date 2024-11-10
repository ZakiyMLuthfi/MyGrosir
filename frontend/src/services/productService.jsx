// src/services/productService.js
import axios from "axios";
import {
  addProduct,
  setProducts,
  removeProduct,
} from "../reducers/productActions";
import { getAuthHeader } from "../utils/authService";

const API_URL = "http://localhost:5000/api/products";

// Fungsi untuk mengambil produk
export const fetchProducts = async (
  currentPage,
  itemsPerPage,
  dispatch,
  searchTerm,
  allData = false
) => {
  try {
    const response = await axios.get(API_URL, {
      params: allData
        ? { allData: true, sort: "updatedAt", search: searchTerm }
        : {
            page: currentPage,
            itemsPerPage,
            sort: "updatedAt",
            search: searchTerm,
          },
      headers: getAuthHeader(),
    });

    console.log("Fetched products in fetchProducts:", response.data.products); // Log untuk debugging

    // Menyimpan produk ke Redux
    dispatch(setProducts(response.data.products));

    return response.data.totalPages;
  } catch (err) {
    if (err.response && err.response.status === 401) {
      console.error("Unauthorized - Redirecting to login");
      window.location.href = "/login";
    } else {
      console.error("Error fetching products", err);
    }
    throw err;
  }
};

// Fungsi untuk menambahkan produk
export const addProductService = async (formData, dispatch) => {
  try {
    const response = await axios.post(API_URL, formData, {
      headers: getAuthHeader(),
    });

    if (response.data.product) {
      dispatch(addProduct(response.data.product));
      console.log("Product added successfully:", response.data.product);
    } else {
      console.error("Product not found in response");
    }
  } catch (error) {
    console.error("Error adding product", error);
    throw error;
  }
};

// Fungsi untuk menghapus produk
export const deleteProductService = async (id, dispatch) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: getAuthHeader(),
    });
    console.log("Product deleted:", response.data);
    dispatch(removeProduct(id));
    return response.data;
  } catch (err) {
    console.error("Error deleting product:", err);
    throw err;
  }
};

// Fungsi untuk merestore produk
export const restoreProductService = async (id) => {
  try {
    const response = await axios.put(`${API_URL}/${id}/restore`, null, {
      headers: getAuthHeader(),
    });
    console.log("Product restored:", response.data);
    return response.data;
  } catch (err) {
    console.error("Error restoring product:", err);
    throw err;
  }
};

// Fungsi untuk mengambil detail produk
export const fetchProductDetail = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: getAuthHeader(),
    });
    const productData = response.data;

    // Ambil detail pengguna jika ada
    if (productData.created_by) {
      const userResponse = await axios.get(
        `http://localhost:5000/api/users/${productData.created_by}`,
        { headers: getAuthHeader() }
      );
      productData.creator = userResponse.data.username; // Misalkan username ada di response
    }

    return productData;
  } catch (error) {
    console.error("Error fetching product detail", error);
    throw error; // Lempar error untuk penanganan lebih lanjut di komponen
  }
};

// Fungsi untuk memperbarui produk
export const updateProduct = async (id, updatedData) => {
  try {
    await axios.put(`${API_URL}/${id}`, updatedData, {
      headers: getAuthHeader(),
    });
  } catch (error) {
    console.error("Error updating product", error);
    throw error;
  }
};
