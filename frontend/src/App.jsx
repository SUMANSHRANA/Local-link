import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AuthProvider, useAuth } from "./context/AuthContext";

// Customer Pages
import HomePage from "./pages/customer/HomePage";
import LoginPage from "./pages/customer/LoginPage";
import RegisterPage from "./pages/customer/RegisterPage";
import ServicesPage from "./pages/customer/ServicesPage";
import ServiceDetailPage from "./pages/customer/ServiceDetailPage";
import CartPage from "./pages/customer/CartPage";
import MyOrdersPage from "./pages/customer/MyOrdersPage";
import MyAccountPage from "./pages/customer/MyAccountPage";
import AboutPage from "./pages/customer/AboutPage";
import ContactPage from "./pages/customer/ContactPage";
import ForgotPasswordPage from "./pages/customer/ForgotPasswordPage";

// Admin Pages
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminServices from "./pages/admin/AdminServices";
import AdminAddService from "./pages/admin/AdminAddService";
import AdminServiceAgents from "./pages/admin/AdminServiceAgents";
import AdminCities from "./pages/admin/AdminCities";
import AdminBookings from "./pages/admin/AdminBookings";

// Service Agent Pages
import SALoginPage from "./pages/serviceAgent/SALoginPage";
import SARegisterPage from "./pages/serviceAgent/SARegisterPage";
import SADashboard from "./pages/serviceAgent/SADashboard";

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading">Loading...</div>;
  if (!user) return <Navigate to={role === "admin" ? "/admin" : role === "serviceAgent" ? "/agent/login" : "/login"} />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Customer Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/services/:id" element={<ServiceDetailPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/cart" element={<ProtectedRoute role="customer"><CartPage /></ProtectedRoute>} />
      <Route path="/my-orders" element={<ProtectedRoute role="customer"><MyOrdersPage /></ProtectedRoute>} />
      <Route path="/my-account" element={<ProtectedRoute role="customer"><MyAccountPage /></ProtectedRoute>} />

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLoginPage />} />
      <Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/services" element={<ProtectedRoute role="admin"><AdminServices /></ProtectedRoute>} />
      <Route path="/admin/services/add" element={<ProtectedRoute role="admin"><AdminAddService /></ProtectedRoute>} />
      <Route path="/admin/services/edit/:id" element={<ProtectedRoute role="admin"><AdminAddService /></ProtectedRoute>} />
      <Route path="/admin/agents" element={<ProtectedRoute role="admin"><AdminServiceAgents /></ProtectedRoute>} />
      <Route path="/admin/cities" element={<ProtectedRoute role="admin"><AdminCities /></ProtectedRoute>} />
      <Route path="/admin/bookings" element={<ProtectedRoute role="admin"><AdminBookings /></ProtectedRoute>} />

      {/* Service Agent Routes */}
      <Route path="/agent/login" element={<SALoginPage />} />
      <Route path="/agent/register" element={<SARegisterPage />} />
      <Route path="/agent/dashboard" element={<ProtectedRoute role="serviceAgent"><SADashboard /></ProtectedRoute>} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <ToastContainer position="top-right" autoClose={3000} />
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}
