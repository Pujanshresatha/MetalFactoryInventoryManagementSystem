import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/auth/AuthContext";
import NavBar from "./components/NavBar";
import Footer from './components/Footer/Footer';
import Homepage from "./components/pages/Home/HomePage";
import AboutPage from "./components/pages/About/about";
import { LoginPage, SignupPage } from "./components/auth/AuthPages";
import ProductPage from "./components/pages/Product/AllProduct";

function App() {
  return (
    <AuthProvider>
      <NavBar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/aboutus" element={<AboutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/allproducts" element={<ProductPage />} />
      </Routes>
      <Footer />
    </AuthProvider>
  );
}

export default App;