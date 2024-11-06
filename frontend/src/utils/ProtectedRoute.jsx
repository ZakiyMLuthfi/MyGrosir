import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token =
    useSelector((state) => state.inventory.token) ||
    localStorage.getItem("accessToken");
  const role =
    useSelector((state) => state.inventory.role) ||
    localStorage.getItem("accessRole");
  console.log("Token di ProtectedRoute:", token, "&", role);

  if (!token || !role) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
