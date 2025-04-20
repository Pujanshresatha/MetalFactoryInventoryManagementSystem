// src/components/Footer/Footer.jsx
import React from "react";

function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-10">
      <div className="container mx-auto text-center">
        <p className="mb-4">&copy; 2025 Metal Factory. All rights reserved.</p>
        <div className="space-x-6">
          <a href="#" className="hover:text-blue-300 transition">Privacy Policy</a>
          <a href="#" className="hover:text-blue-300 transition">Terms of Service</a>
          <a href="#" className="hover:text-blue-300 transition">Contact Us</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer; // ✅ This line is important!
