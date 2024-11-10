import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const token =
    useSelector((state) => state.inventory.token) ||
    localStorage.getItem("accessToken");
  const role =
    useSelector((state) => state.inventory.role) ||
    localStorage.getItem("accessRole");

  if (!token || !role) {
    return <Navigate to="/login" replace />;
  }
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" />;
  }
  return children;
};

export default ProtectedRoute;
