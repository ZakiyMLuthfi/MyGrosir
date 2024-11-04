import store from "../store/index";

export const getAuthHeader = () => {
  const state = store.getState();
  const token = state.inventory.token;

  return token ? { Authorization: `Bearer ${token}` } : {};
};
