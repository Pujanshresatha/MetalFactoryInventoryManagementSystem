import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "./customer/auth/AuthContext"; // Import the AuthContext
import { useCart } from "./cart/CartContext"; // Import the cart context
import logo from "@assets/images/logo.png";
import { Import } from "lucide-react";

function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth(); // Get user from AuthContext
  const location = useLocation();
  const { cartCount } = useCart(); // Get cart count from context

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Define navItems based on user role
  const getNavItems = () => {
    if (!user) {
      // Default for non-logged-in users (same as Customer)
      return [
        { name: "Home", path: "/" },
        { name: "All Product", path: "/allproducts" },
        {
          name: "MyCart",
          path: "/cart",
          badge: cartCount > 0 ? cartCount : null,
        },
        { name: "OrderHistory", path: "/OrderHistory" },
        { name: "Settings", path: "/settings" },
        { name: "About us", path: "/aboutus" },
      ];
    }

    switch (user.role.toLowerCase()) {
      case "seller":
        return [
          { name: "Dashboard", path: "/seller/dashboard" },
          { name: "Product Management", path: "/seller/product-management" },
          { name: "Order Management", path: "/seller/order-management" },
          { name: "Settings", path: "/settings" },
        ];
      case "supervisor":
        return [
          { name: "Dashboard", path: "/supervisor/dashboard" },
          { name: "Employee Monitoring", path: "/supervisor/employee-monitoring" },
          { name: "Production Tracking", path: "/supervisor/production-tracking" },
          { name: "Settings", path: "/settings" },
        ];
      case "customer":
      default:
        return [
          { name: "Home", path: "/" },
          { name: "All Product", path: "/allproducts" },
          {
            name: "MyCart",
            path: "/cart",
            badge: cartCount > 0 ? cartCount : null,
          },
          { name: "OrderHistory", path: "/OrderHistory" },
          { name: "Settings", path: "/settings" },
          { name: "About us", path: "/aboutus" },
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          {/* Logo + Brand */}
          <Link to="/" className="flex items-center space-x-2">
            <img
              src={logo}
              alt="InventoryPro Logo"
              className="h-10 w-auto transition-transform duration-300 hover:scale-110"
            />
            <span className="text-2xl font-semibold text-blue-700 tracking-tight">
              Metal Factory
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`relative text-gray-600 font-medium text-md hover:text-blue-600 transition-all duration-300 pb-1 ${
                  location.pathname === item.path ? "text-blue-600" : ""
                }`}
              >
                <div className="flex items-center">
                  {item.name}
                  {item.badge && (
                    <span className="ml-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span
                  className={`absolute bottom-0 left-0 h-[2px] bg-blue-600 transition-all duration-300 ${
                    location.pathname === item.path ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                ></span>
              </Link>
            ))}
          </div>

          {/* Desktop Profile/Username */}
          <div className="hidden md:flex items-center space-x-5">
            <Link
              to="/profile"
              className="text-gray-600 hover:text-blue-600 transition-colors duration-300"
              aria-label="Profile"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </Link>
            {user ? (
              <Link
                to="/profile"
                className="text-gray-600 font-medium text-md hover:text-blue-600 transition-all duration-300"
              >
                {user.username}
              </Link>
            ) : (
              <Link
                to="/login"
                className="bg-blue-600 text-white px-5 py-2 rounded-full font-medium hover:bg-blue-700 transition duration-300 shadow-md"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-600 hover:text-blue-600 focus:outline-none"
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={
                    isMenuOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          id="mobile-menu"
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? "max-h-screen pt-4" : "max-h-0"
          }`}
        >
          <div className="flex flex-col items-center space-y-4 pb-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="text-gray-600 font-medium text-lg hover:text-blue-600 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center">
                  {item.name}
                  {item.badge && (
                    <span className="ml-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </div>
              </Link>
            ))}
            <Link
              to="/profile"
              onClick={() => setIsMenuOpen(false)}
              className="text-gray-600 hover:text-blue-600"
              aria-label="Profile"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </Link>
            {user ? (
              <Link
                to="/profile"
                className="text-gray-600 font-medium text-lg hover:text-blue-600 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                {user.username}
              </Link>
            ) : (
              <Link
                to="/login"
                className="bg-blue-600 text-white px-4 py-2 rounded-full font-medium hover:bg-blue-700 transition duration-300 shadow"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;