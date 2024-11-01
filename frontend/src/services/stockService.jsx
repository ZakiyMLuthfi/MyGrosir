// src/services/stockService.js
import axios from "axios";
import {
  setStockIns,
  setStockOuts,
  addStockIn,
  setStockHistories,
} from "../reducers/stockActions";
import { setProducts } from "../reducers/productActions";
import { setSuppliers } from "../reducers/supplierActions";

const API_URL = "http://localhost:5000/api/stocks";
const DEFAULT_URL = "http://localhost:5000/api/";

export const fetchProducts = async (dispatch) => {
  try {
    const response = await axios.get(`${DEFAULT_URL}products`);
    dispatch(setProducts(response.data)); // Dispatch produk ke Redux
    console.log(response.data);
  } catch (error) {
    console.error("Error fetching products", error);
    throw error;
  }
};

export const fetchSuppliers = async (dispatch) => {
  try {
    const response = await axios.get(`${DEFAULT_URL}suppliers`);
    dispatch(setSuppliers(response.data)); // Dispatch produk ke Redux
  } catch (error) {
    console.error("Error fetching suppliers", error);
    throw error;
  }
};

export const fetchStockIns = async (
  currentPage,
  itemsPerPage,
  dispatch,
  searchTerm
) => {
  try {
    const response = await axios.get(`${API_URL}/stock-in`, {
      params: {
        page: currentPage,
        itemsPerPage,
        sort: "updatedAt",
        search: searchTerm,
      },
    });
    dispatch(setStockIns(response.data.stockIns));
    return response.data.totalPages;
  } catch (err) {
    console.error("Error fetching stock-in", err);
    throw err;
  }
};

export const fetchStockOuts = async (
  currentPage,
  itemsPerPage,
  dispatch,
  searchTerm
) => {
  try {
    const response = await axios.get(`${API_URL}/stock-out`, {
      params: {
        page: currentPage,
        itemsPerPage,
        sort: "updatedAt",
        search: searchTerm,
      },
    });
    dispatch(setStockOuts(response.data.stockOuts));
    return response.data.totalPages;
  } catch (err) {
    console.error("Error fetching stock-in", err);
    throw err;
  }
};

export const fetchStockHistories = async (
  currentPage,
  itemsPerPage,
  dispatch,
  searchTerm
) => {
  try {
    const response = await axios.get(`${API_URL}/stock-history`, {
      params: {
        page: currentPage,
        itemsPerPage,
        sort: "updatedAt",
        search: searchTerm,
      },
    });
    dispatch(setStockHistories(response.data.stockHistories));
    return response.data.totalPages;
  } catch (err) {
    console.error("Error fetching stock histories", err);
    throw err;
  }
};

export const addStockInService = async (formData, dispatch) => {
  try {
    const formDataWithUserId = {
      ...formData,
      created_by: "ultraadmin",
      updated_by: "ultraadmin",
    };

    const response = await axios.post(
      `${API_URL}/stock-in`,
      formDataWithUserId
    );

    if (response.data.stockIn) {
      dispatch(addStockIn(response.data.stockIn));
      console.log("Stock-in added succesfully:", response.data.stockIn);
    } else {
      console.error("Stock-in not found in respons");
    }
  } catch (error) {
    console.error("Error adding stock-in", error);
    throw error;
  }
};

export const updateStockOut = async (id, formData) => {
  try {
    const updatedData = {
      ...formData,
      updated_by: "ultraadmin",
    };

    await axios.put(`${API_URL}/stock-out/${id}`, updatedData);
  } catch (error) {
    if (error.response) {
      console.error("Error data:", error.response.data); // Menampilkan detail error dari server
    }
    console.error("Error updating stock-out with remaining quantity", error);
    throw error;
  }
};

export const fetchStockInDetail = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/stock-in/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching stock-in detail", error);
    throw error;
  }
};

export const fetchStockOutDetail = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/stock-out/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching stock-out detail", error);
    throw error;
  }
};

export const fetchStockHistoryDetail = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/stock-history/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching stock-history detail", error);
    throw error;
  }
};
