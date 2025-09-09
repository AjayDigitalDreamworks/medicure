// Logout.jsx
import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";

const Logout = ({ setIsAuthenticated, setUserRole }) => {
  useEffect(() => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUserRole(null);
  }, []);

  return <Navigate to="/login" replace />;
};

export default Logout;
