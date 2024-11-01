import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LayoutTemp from "./components/LayoutTemp";
import ProductPage from "./components/pages/ProductPage";
import SupplierPage from "./components/pages/SupplierPage";
import StockInPage from "./components/pages/StockInPage";
import StockOutPage from "./components/pages/StockOutPage";
import StockHistoryPage from "./components/pages/StockHistoryPage";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LayoutTemp />}>
          <Route path="/products" element={<ProductPage />} />
          <Route path="/suppliers" element={<SupplierPage />} />
          <Route path="/stocks/stock-in" element={<StockInPage />} />
          <Route path="/stocks/stock-out" element={<StockOutPage />} />
          <Route path="/stocks/stock-history" element={<StockHistoryPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
