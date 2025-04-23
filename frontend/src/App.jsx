// import React from "react";
// import { Routes, Route } from "react-router-dom";
// import { AuthProvider } from "./components/auth/AuthContext";
// import NavBar from "./components/NavBar";
// import Footer from './components/Footer/Footer';
// import Homepage from "./components/pages/Home/HomePage";
// import AboutPage from "./components/pages/About/about";
// import { LoginPage, SignupPage } from "./components/auth/AuthPages";
// import ProductPage from "./components/pages/Product/AllProduct";

// function App() {
//   return (
//     <AuthProvider>
//       <NavBar />
//       <Routes>
//         <Route path="/" element={<Homepage />} />
//         <Route path="/aboutus" element={<AboutPage />} />
//         <Route path="/login" element={<LoginPage />} />
//         <Route path="/signup" element={<SignupPage />} />
//         <Route path="/allproducts" element={<ProductPage />} />
//       </Routes>
//       <Footer />
//     </AuthProvider>
//   );
// }

// export default App;




// // import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// // import { AuthProvider } from './components/auth/AuthContext';
// // import HomePage from './components/pages/Home/HomePage';
// // import { LoginPage, SignupPage } from './components/auth/AuthPages';
// // import AdminDashboard from './components/admin/AdminDashboard';
// // import SupervisorDashboard from './components/supervisor/SupervisorDashboard';
// // import SellerDashboard from './components/seller/SellerDashboard';
// // import CustomerDashboard from './components/customer/CustomerDashboard';
// // import AllProduct from './components/pages/Product/AllProduct';
// // import About from './components/pages/About/about';

// // export default function App() {
// //   return (
// //     <AuthProvider>
// //       <Router>
// //         <Routes>
// //           <Route path="/" element={<HomePage />} />
// //           <Route path="/login" element={<LoginPage />} />
// //           <Route path="/signup" element={<SignupPage />} />
// //           <Route path="/admin" element={<AdminDashboard />} />
// //           <Route path="/supervisor" element={<SupervisorDashboard />} />
// //           <Route path="/seller" element={<SellerDashboard />} />
// //           <Route path="/customer" element={<CustomerDashboard />} />
// //           <Route path="/products" element={<AllProduct />} />
// //           <Route path="/about" element={<About />} />
// //         </Routes>
// //       </Router>
// //     </AuthProvider>
// //   );
// // }




import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/customer/auth/AuthContext";
import NavBar from "./components/NavBar";
import Footer from './components/Footer/Footer';
import Homepage from "./components/pages/Home/HomePage";
import AboutPage from "./components/pages/About/about";
import { LoginPage, SignupPage } from "./components/customer/auth/AuthPages";
import ProductPage from "./components/pages/Product/AllProduct";
import AdminDashboard from "./components/admin/AdminDashboard";
import SupervisorDashboard from "./components/supervisor/SupervisorDashboard";
import SupervisorEmployeeMonitoring from "./components/supervisor/EmployeeMonitoring";
import ProductTrackingPage from "./components/supervisor/ProductTracking";
import SellerDashboard from "./components/seller/SellerDashboard";
import ProductManagement from "./components/seller/productManagement";
import OrderManagement from "./components/seller/orderManagement";
import ChangePasswordForm from "./components/setttings/setting";
import Cart from './components/cart/cart';
import { CartProvider } from './components/cart/CartContext';

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
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/supervisor/dashboard" element={<SupervisorDashboard />} />
        <Route path="/supervisor/employee-monitoring" element={<SupervisorEmployeeMonitoring />} />
        <Route path="/supervisor/production-tracking" element={<ProductTrackingPage />} />
        <Route path="/seller/dashboard" element={<SellerDashboard />} />
        <Route path="/seller/product-management" element={<ProductManagement />} />
        <Route path="/seller/order-management" element={<OrderManagement />} />
        <Route path="/settings" element={<ChangePasswordForm />} />
        <Route path="/cart" element={<Cart/>} />
      </Routes>
      <Footer />
    </CartProvider>
    </AuthProvider>
  );
}

export default App;