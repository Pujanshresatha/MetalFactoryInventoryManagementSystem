import React, { useContext } from 'react';
import { AuthContext } from '../auth/AuthContext';
// import NavBar from '../NavBar';

export default function SellerDashboard() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* <NavBar /> */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-800">Seller Dashboard</h1>
          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Welcome, {user?.username} (Seller)</h2>
          <p className="text-gray-600">
            Manage product listings and sales here.
          </p>
          {/* Add seller-specific features like product management, sales tracking */}
        </div>
      </div>
    </div>
  );
}