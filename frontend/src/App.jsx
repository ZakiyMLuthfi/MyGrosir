import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LayoutTemp from "./components/LayoutTemp";
import ProductPage from "./components/pages/ProductPage";
import SupplierPage from "./components/pages/SupplierPage";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LayoutTemp />}>
          <Route path="/products" element={<ProductPage />} />
          <Route path="/suppliers" element={<SupplierPage />} />
          <Route path="/stocks/stock-in" element={<SupplierPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
