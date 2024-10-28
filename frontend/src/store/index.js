// index.js
import { createStore, combineReducers } from "redux";
import productReducer from "./reducers/productReducer"; // Import reducer

const rootReducer = combineReducers({
  products: productReducer,
});

const store = createStore(rootReducer);

export default store;
