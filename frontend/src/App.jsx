import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setToken } from "./reducers/userActions";
import ProtectedRoute from "./utils/protectedRoute";
import LayoutTemp from "./components/LayoutTemp";
import ProductPage from "./components/pages/ProductPage";
import SupplierPage from "./components/pages/SupplierPage";
import StockInPage from "./components/pages/StockInPage";
import StockOutPage from "./components/pages/StockOutPage";
import StockHistoryPage from "./components/pages/StockHistoryPage";
import DashboardPage from "./components/pages/DashboardPage";
import UserPage from "./components/pages/UserPage";
import LoginForm from "./components/pages/LoginForm";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const savedToken = localStorage.getItem("accessToken");
    const savedRole = localStorage.getItem("accessRole");

    if (savedToken && savedRole) {
      dispatch(setToken({ token: savedToken, role: savedRole })); // Set token di Redux state
      console.log(
        `Token dari localStorage berhasil di-set ke Redux: ${savedToken} & ${savedRole}`
      );
    }
  }, [dispatch]);

  const handleLoginSuccess = () => {
    console.log("Login successful!");
    navigate("/products"); // Navigasi ke halaman produk
  };

  return (
    <Routes>
      <Route
        path="/login"
        element={<LoginForm onLoginSuccess={handleLoginSuccess} />}
      />
      <Route path="/" element={<LayoutTemp />}>
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <ProductPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/suppliers"
          element={
            <ProtectedRoute>
              <SupplierPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/stocks/stock-in"
          element={
            <ProtectedRoute>
              <StockInPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/stocks/stock-out"
          element={
            <ProtectedRoute>
              <StockOutPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/stocks/stock-history"
          element={
            <ProtectedRoute>
              <StockHistoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <UserPage />
            </ProtectedRoute>
          }
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
