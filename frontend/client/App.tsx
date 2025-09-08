import "./global.css";
import "bootstrap/dist/css/bootstrap.min.css";

import React from "react";
import Logout from "./pages/Logout"; // Adjust path if needed

import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

// Layouts
import AdminLayout from "@/components/layout/AdminLayout";
import DoctorLayout from "@/components/layout/DoctorLayout";
import PatientLayout from "@/components/layout/PatientLayout";

// Pages
import Admin_Dash from "./pages/admin/Index";
import Inventory from "./pages/admin/Inventory";
import Index from "./pages/admin/Index";
import OPD from "./pages/admin/OPD";
import Doctors from "./pages/admin/Doctors";
import Upload from "./pages/admin/Upload";

import Doctor_Dash from "./pages/doctor/Index";

import Patient_Dash from "./pages/patient/Dashboard";
import Appointments from "./pages/patient/Appointments";
import AddPatient from "./pages/patient/AddPatient";
import Reports from "./pages/patient/Reports";

import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
// import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Signup";

import jwt_decode from "jwt-decode";

type MyJwtPayload = {
  role: string;
};

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [userRole, setUserRole] = React.useState<string | null>(null);
  const [authLoaded, setAuthLoaded] = React.useState(false);
 console.log("role:", userRole);
  React.useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwt_decode<MyJwtPayload>(token);
        setIsAuthenticated(true);
        setUserRole(decoded.role); // role: "admin", "doctor", "patient"
      } catch (err) {
        console.error("Invalid token:", (err as Error).message);
        localStorage.removeItem("token");
      }
    }
    setAuthLoaded(true); // ✅ Done checking token
  }, []);

 const DashboardRedirect = () => {
    if (!authLoaded) return null; // 🕓 wait until we check auth
console.log("redirected user :", userRole);
    if (!userRole) return <Navigate to="/login" />;
  
    switch (userRole) {
      case "admin":
        return <Navigate to="/adminDashboard" />;
      case "doctor":
        return <Navigate to="/doctorDashboard" />;
      case "patient":
        return <Navigate to="/patientDashboard" />;
      default:
        return <Navigate to="/" />;
    }
  };


  if (!authLoaded) return <div>Loading...</div>; // Optional global loading UI


  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Redirect based on user role */}
            <Route path="/dashboard" element={<DashboardRedirect />} />

            {/* Public routes */}
            <Route
              path="/"
              element={
                <Home
                  isAuthenticated={isAuthenticated}
                  setIsAuthenticated={setIsAuthenticated}
                />
              }
            />
            <Route path="/logout" element={
  <Logout
    setIsAuthenticated={setIsAuthenticated}
    setUserRole={setUserRole}
  />
} />

            <Route
              path="/login"
              element={
                <Login
                  setIsAuthenticated={setIsAuthenticated}
                  setUserRole={setUserRole}
                />
              }
            />
            <Route path="/signup" element={<Register />} />

            {/* Admin routes */}
            <Route
              path="/adminDashboard"
              element={
                isAuthenticated && userRole === "admin" ? (
                  <AdminLayout>
                    <Outlet />
                  </AdminLayout>
                ) : (
                  <Navigate to="/login" />
                )
              }
            >
              <Route index element={<Admin_Dash />} />
              <Route path="inventory" element={<Inventory />} />
              {/* <Route path="bed" element={<Index />} /> */}
               <Route path="opd" element={<OPD />} />
               <Route path="doctors" element={<Doctors />} />
              <Route path="upload" element={<Upload />} />

            </Route>

            {/* Doctor routes */}

            <Route
              path="/doctorDashboard"
              element={
                isAuthenticated && userRole === "doctor" ? (
                  <DoctorLayout />
                ) : (
                  <Navigate to="/login" />
                )
              }
            >
              <Route index element={<Doctor_Dash 
              
              isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
        setUserRole={setUserRole}
              />} />
              {/* <Route path="appointments" element={<Appointments />} />
              <Route path="doctors" element={<DoctorsManage />} />
              <Route path="inventory" element={<InventoryManage />} />
              <Route path="opd" element={<OpdManage />} />
              <Route path="upload" element={<UploadManage />} /> */}
              {/* Add more doctor routes here */}
            </Route>

            {/* Patient routes */}
            <Route
              path="/patientDashboard"
              element={
                isAuthenticated && userRole === "patient" ? (
                  <PatientLayout />
                ) : (
                  <Navigate to="/login" />
                )
              }
            >
              <Route index element={<Patient_Dash />} />
              <Route path="appointments" element={<Appointments />} />
              <Route path="add-patient" element={<AddPatient />} />
              <Route path="reports" element={<Reports />} />
              {/* Add more patient routes here */}
            </Route>

            {/* Fallback route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

createRoot(document.getElementById("root")!).render(<App />);
