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
import { getAuthHeader } from "../utils/authService";

const API_URL = "http://localhost:5000/api/stocks";
const DEFAULT_URL = "http://localhost:5000/api";

export const fetchProducts = async (
  currentPage,
  itemsPerPage,
  dispatch,
  searchTerm,
  allData = false
) => {
  try {
    const response = await axios.get(`${DEFAULT_URL}/products`, {
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
    console.log("Fetched Products:", response.data.products);
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

export const fetchSuppliers = async (
  currentPage,
  itemsPerPage,
  dispatch,
  searchTerm,
  allData = false
) => {
  try {
    const response = await axios.get(`${DEFAULT_URL}/suppliers`, {
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
    console.log("Fetched Suppliers:", response.data.suppliers);
    dispatch(setSuppliers(response.data.suppliers));
    return response.data.totalPages;
  } catch (err) {
    if (err.response && err.response.status === 401) {
      console.error("Unauthorized - Redirecting to login");
      window.location.href = "/login";
    } else {
      console.error("Error fetching suppliers", err);
    }
    throw err;
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
      headers: getAuthHeader(),
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
      headers: getAuthHeader(),
    });
    dispatch(setStockOuts(response.data.stockOuts));
    return response.data.totalPages;
  } catch (err) {
    console.error("Error fetching stock-out", err);
    throw err;
  }
};

export const fetchStockHistories = async (
  currentPage,
  itemsPerPage,
  dispatch,
  searchTerm,
  allData = false
) => {
  try {
    const response = await axios.get(`${API_URL}/stock-history`, {
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
    console.log("Fetched stock histories:", response.data.stockHistories);
    dispatch(setStockHistories(response.data.stockHistories));
    return response.data.totalPages;
  } catch (err) {
    if (err.response && err.response.status === 401) {
      console.error("Unauthorized - Redirecting to login");
      window.location.href = "/login";
    } else {
      console.error("Error fetching stock histories", err);
    }
    throw err;
  }
};

export const addStockInService = async (formData, dispatch) => {
  try {
    const response = await axios.post(`${API_URL}/stock-in`, formData, {
      headers: getAuthHeader(),
    });

    if (response.data.stockIn) {
      dispatch(addStockIn(response.data.stockIn));
    } else {
      console.error("Stock-in not found in response");
    }
  } catch (error) {
    console.error("Error adding stock-in", error);
    throw error;
  }
};

export const updateStockOut = async (id, formData) => {
  try {
    await axios.put(`${API_URL}/stock-out/${id}`, formData, {
      headers: getAuthHeader(),
    });
  } catch (error) {
    if (error.response) {
      console.error("Error data:", error.response.data);
    }
    console.error("Error updating stock-out with remaining quantity", error);
    throw error;
  }
};

export const fetchStockInDetail = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/stock-in/${id}`, {
      headers: getAuthHeader(),
    });
    const stockInData = response.data;

    if (stockInData.created_by) {
      const userResponse = await axios.get(
        `http://localhost:5000/api/users/${stockInData.created_by}`,
        { headers: getAuthHeader() }
      );
      stockInData.creator = userResponse.data.username; // Misalkan username ada di response
    }

    return stockInData;
  } catch (error) {
    console.error("Error fetching stock-in detail", error);
    throw error;
  }
};

export const fetchStockOutDetail = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/stock-out/${id}`, {
      headers: getAuthHeader(),
    });
    const stockOutData = response.data;

    if (stockOutData.created_by) {
      const userResponse = await axios.get(
        `http://localhost:5000/api/users/${stockOutData.created_by}`,
        { headers: getAuthHeader() }
      );
      stockOutData.creator = userResponse.data.username; // Misalkan username ada di response
    }

    return stockOutData;
  } catch (error) {
    console.error("Error fetching stock-out detail", error);
    throw error;
  }
};

export const fetchStockHistoryDetail = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/stock-history/${id}`, {
      headers: getAuthHeader(),
    });
    const stockHistoryData = response.data;

    if (stockHistoryData.created_by) {
      const userResponse = await axios.get(
        `http://localhost:5000/api/users/${stockHistoryData.created_by}`,
        { headers: getAuthHeader() }
      );
      stockHistoryData.creator = userResponse.data.username; // Misalkan username ada di response
    }

    return stockHistoryData;
  } catch (error) {
    console.error("Error fetching stock-history detail", error);
    throw error;
  }
};
