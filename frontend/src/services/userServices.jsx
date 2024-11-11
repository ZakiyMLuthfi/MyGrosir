// src/services/UserService.js
import axios from "axios";
import { addUser, setUsers, removeUser } from "../reducers/userActions";
const API_URL = "http://localhost:5000/api/users";

import { getAuthHeader } from "../utils/authService";
// Fungsi untuk mendapatkan header autentikasi

// Fungsi untuk mengambil user
export const fetchUsers = async (
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
    dispatch(setUsers(response.data.users));
    return response.data.totalPages;
  } catch (err) {
    console.error("Error fetching users", err);
    throw err; // Lempar kesalahan untuk penanganan lebih lanjut
  }
};

// Fungsi untuk menambahkan user
export const addUserService = async (formData, dispatch) => {
  try {
    const response = await axios.post(API_URL, formData, {
      headers: getAuthHeader(),
    });

    if (response.data.user) {
      dispatch(addUser(response.data.user));
      console.log("User added successfully:", response.data.user);
    } else {
      console.error("User not found in response");
    }
  } catch (error) {
    console.error("Error adding user", error);
    throw error; // Lempar kesalahan untuk penanganan lebih lanjut
  }
};

// Fungsi untuk menghapus user
export const deleteUserService = async (id, dispatch) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: getAuthHeader(),
    });
    console.log("User deleted:", response.data);
    dispatch(removeUser(id));
    return response.data;
  } catch (err) {
    console.error("Error deleting user:", err);
    throw err; // Lempar kesalahan untuk penanganan lebih lanjut
  }
};

// Fungsi untuk merestore user
export const restoreUserService = async (id) => {
  try {
    const response = await axios.put(
      `${API_URL}/${id}/restore`,
      {},
      {
        headers: getAuthHeader(),
      }
    );
    console.log("User restored:", response.data);
    return response.data;
  } catch (err) {
    console.error("Error restoring user:", err);
    throw err; // Lempar kesalahan untuk penanganan lebih lanjut
  }
};

// Fungsi untuk mengambil detail User
export const fetchUserDetail = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: getAuthHeader(),
    });
    const userData = response.data;

    // Ambil detail pengguna jika ada
    if (userData.created_by) {
      const userResponse = await axios.get(
        `${API_URL}/${userData.created_by}`,
        { headers: getAuthHeader() }
      );
      userData.creator = userResponse.data.username; // Misalkan username ada di response
    }

    return userData;
  } catch (error) {
    console.error("Error fetching User detail", error);
    throw error; // Lempar kesalahan untuk penanganan lebih lanjut di komponen
  }
};

// Fungsi untuk memperbarui User
export const updateUser = async (id, updatedData, dispatch) => {
  try {
    await axios.put(`${API_URL}/${id}`, updatedData, {
      headers: getAuthHeader(),
    });
    dispatch(setUsers(updatedData)); // Jika Anda ingin memperbarui state di redux
  } catch (error) {
    console.error("Error updating User", error);
    throw error; // Lempar kesalahan untuk penanganan lebih lanjut
  }
};
