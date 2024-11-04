import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import { useDispatch } from "react-redux";
import { setToken } from "./reducers/userActions";
import LayoutTemp from "./components/LayoutTemp";
import ProductPage from "./components/pages/ProductPage";
import SupplierPage from "./components/pages/SupplierPage";
import StockInPage from "./components/pages/StockInPage";
import StockOutPage from "./components/pages/StockOutPage";
import StockHistoryPage from "./components/pages/StockHistoryPage";
import LoginForm from "./components/pages/LoginForm";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      dispatch(setToken(token)); // Set token di Redux state
    }
  }, [dispatch]);

  const handleLoginSuccess = () => {
    console.log("Login successful!");
    navigate("/products"); // Navigasi ke halaman produk
  };

  return (
    <Routes>
      <Route path="/" element={<LayoutTemp />}>
        <Route path="/products" element={<ProductPage />} />
        <Route path="/suppliers" element={<SupplierPage />} />
        <Route path="/stocks/stock-in" element={<StockInPage />} />
        <Route path="/stocks/stock-out" element={<StockOutPage />} />
        <Route path="/stocks/stock-history" element={<StockHistoryPage />} />
        <Route
          path="/login"
          element={<LoginForm onLoginSuccess={handleLoginSuccess} />}
        />
      </Route>
    </Routes>
  );
}

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
