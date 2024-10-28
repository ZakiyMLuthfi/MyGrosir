import { createRoot } from "react-dom/client";
import React from "react";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "./store/index.js";
import "./index.css";
import { StrictMode } from "react";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
