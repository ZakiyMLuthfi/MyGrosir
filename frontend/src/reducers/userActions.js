// src/reducers/userAction.js

export const setToken = ({ token, role }) => ({
  type: "SET_TOKEN",
  payload: { token, role },
});

export const clearToken = () => ({
  type: "CLEAR_TOKEN",
});

export const setUsers = (users) => ({
  type: "SET_USERS",
  payload: users,
});

export const addUser = (user) => ({
  type: "ADD_USER",
  payload: user,
});

export const removeUser = (id) => ({
  type: "REMOVE_USER",
  payload: id,
});
