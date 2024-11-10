// src/services/supplierService.js
import axios from "axios";
import {
  addSupplier,
  setSuppliers,
  removeSupplier,
} from "../reducers/supplierActions";
import { getAuthHeader } from "../utils/authService";

const API_URL = "http://localhost:5000/api/suppliers";

export const fetchSuppliers = async (
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

export const addSupplierService = async (formData, dispatch) => {
  try {
    const response = await axios.post(API_URL, formData, {
      headers: getAuthHeader(),
    });

    console.log("Response from API:", response.data); // Log response untuk memeriksa struktur data

    if (response.data.supplier) {
      dispatch(addSupplier(response.data.supplier));
      console.log("Supplier added successfully:", response.data.supplier);
    } else {
      console.error("Supplier not found in response");
    }
  } catch (error) {
    console.error("Error adding supplier", error);
    throw error;
  }
};

export const deleteSupplierService = async (id, dispatch) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: getAuthHeader(),
    });
    console.log("Supplier deleted: ", response.data);
    dispatch(removeSupplier(id));
    return response.data;
  } catch (err) {
    console.error("Error deleting supplier:", err);
    throw err;
  }
};

export const restoreSupplierService = async (id) => {
  try {
    const response = await axios.put(`${API_URL}/${id}/restore`, null, {
      headers: getAuthHeader(),
    });
    console.log("Supplier restored: ", response.data);
    return response.data;
  } catch (err) {
    console.error("Error restoring supplier: ", err);
    throw err;
  }
};

export const fetchSupplierDetail = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: getAuthHeader(),
    });
    const supplierData = response.data;

    // Ambil detail pengguna jika ada
    if (supplierData.created_by) {
      const userResponse = await axios.get(
        `http://localhost:5000/api/users/${supplierData.created_by}`,
        { headers: getAuthHeader() }
      );
      supplierData.creator = userResponse.data.username; // Misalkan username ada di response
    }

    return supplierData;
  } catch (error) {
    console.error("Error fetching supplier detail", error);
    throw error; // Lempar error untuk penanganan lebih lanjut di komponen
  }
};

export const updateSupplier = async (id, updatedData) => {
  try {
    await axios.put(`${API_URL}/${id}`, updatedData, {
      headers: getAuthHeader(),
    });
  } catch (error) {
    console.error("Error updating supplier", error);
    throw error;
  }
};
