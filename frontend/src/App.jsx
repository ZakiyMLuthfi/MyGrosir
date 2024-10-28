import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LayoutTemp from "./components/LayoutTemp";
import ProductPage from "./components/pages/ProductPage";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LayoutTemp />}>
          <Route path="/products" element={<ProductPage />} />
        </Route>
      </Routes>
    </Router>asdasd
  );
}

export default App;
