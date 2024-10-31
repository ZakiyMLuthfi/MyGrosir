// src/services/supplierService.js
import axios from "axios";
import {
  addSupplier,
  setSuppliers,
  removeSupplier,
} from "../reducers/supplierActions";

const API_URL = "http://localhost:5000/api/suppliers";

export const fetchSuppliers = async (
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
    dispatch(setSuppliers(response.data.suppliers));
    return response.data.totalPages;
  } catch (err) {
    console.error("Error fetching suppliers", err);
    throw err;
  }
};

export const addSupplierService = async (formData, dispatch) => {
  try {
    const formDataWithUserId = {
      ...formData,
      created_by: "ultraadmin",
      updated_by: "ultraadmin",
    };
    console.log(formDataWithUserId);

    if (response.data.supplier) {
      dispatch(addSupplier(response.data.supplier));
      console.log("Supplier added successfully:", response.data.supplier);
    } else {
      console.error("Supplier not found in respons");
    }
  } catch (error) {
    console.error("Error adding supplier", error);
    throw error;
  }
};

export const deleteSupplierService = async (id, dispatch) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    console.log("Supplier deleted: ", response.data);
    dispatch(removeSupplier(id));
    return response.data;
  } catch (err) {
    console.error("Error deleting suplier:", err);
    throw err;
  }
};

export const restoreSupplierService = async (id) => {
  try {
    const response = await axios.put(`${API_URL}/${id}/restore`);
    console.log("Supplier restored: ", response.data);
    return response.data;
  } catch (err) {
    console.error("Error restoring supplier: ", err);
    throw err;
  }
};

export const fetchSupplierDetail = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching supplier detail", error);
    throw error;
  }
};

export const updateSupplier = async (id, updatedData) => {
  try {
    await axios.put(`${API_URL}/${id}`, updatedData);
  } catch (error) {
    console.error("Error updating supplier", error);
    throw error;
  }
};
