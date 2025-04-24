import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/users/auth/AuthContext";
import NavBar from "./components/NavBar";
import Footer from './components/Footer/Footer';
import Homepage from "./components/pages/Home/HomePage";
import AboutPage from "./components/pages/About/about";
import { LoginPage, SignupPage } from "./components/users/auth/AuthPages";
import ProductPage from "./components/pages/Product/AllProduct";
import { CartProvider } from './components/customer/CartContext';

// Admin
import AdminDashboard from "./components/admin/AdminDashboard";
import ManageProducts from "./components/admin/ManageProducts";
import ManageOrders from "./components/admin/ManageOrders"; 
import ManageUsers from "./components/admin/ManageUsers";

// Supervisor
import SupervisorDashboard from "./components/supervisor/SupervisorDashboard";
import SupervisorEmployeeMonitoring from "./components/supervisor/EmployeeMonitoring";
import ProductTrackingPage from "./components/supervisor/ProductTracking";

// Seller
import SellerDashboard from "./components/seller/SellerDashboard";

// Customer
import OrderHistory from "./components/customer/OrderHistory";
import RequestOrder from "./components/customer/RequestOrder";
import CustomerProfile from "./components/customer/CustomerProfile";
import Cart from "./components/customer/Cart";

import ChangePasswordForm from "./components/setttings/setting";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <NavBar />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/aboutus" element={<AboutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/allproducts" element={<ProductPage />} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/manage-products" element={<ManageProducts />} />
          <Route path="/admin/manage-users" element={<ManageUsers />} />
          <Route path="/admin/manage-orders" element={<ManageOrders />} />

          {/* Customer Routes */}
          <Route path="/customer/request-order" element={<RequestOrder />} />
          <Route path="/customer/order-history" element={<OrderHistory />} />
          <Route path="/customer/profile" element={<CustomerProfile />} />
          <Route path="/customer/cart" element={<Cart />} />

          {/* Supervisor Routes */}
          <Route path="/supervisor/dashboard" element={<SupervisorDashboard />} />
          <Route path="/supervisor/employee-monitoring" element={<SupervisorEmployeeMonitoring />} />
          <Route path="/supervisor/production-tracking" element={<ProductTrackingPage />} />

          {/* Seller Routes */}
          <Route path="/seller/dashboard" element={<SellerDashboard />} />
          <Route path="/seller/product-management" element={<ManageProducts />} />
          <Route path="/seller/order-management" element={<ManageOrders />} />

          {/* Other */}
          <Route path="/settings" element={<ChangePasswordForm />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
        <Footer />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
