// index.js
import { createStore, combineReducers } from "redux";
import inventoryReducer from "./inventoryReducer"; // Import reducer

const rootReducer = combineReducers({
  inventory: inventoryReducer,
});

const store = createStore(rootReducer);

export default store;
