import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
// import CustomerNavbar from './CustomerNavbar';

function CustomerDashboard() {
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecentOrders = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/api/customer/orders', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        // Get the 3 most recent orders
        setRecentOrders(response.data.slice(0, 3));
        setError('');
      } catch (err) {
        setError('Error fetching recent orders: ' + (err.response?.data?.error || err.message));
      } finally {
        setLoading(false);
      }
    };
    fetchRecentOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* <CustomerNavbar /> */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Welcome to Your Dashboard</h1>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link
            to="/customer/request-order"
            className="bg-blue-600 text-white py-4 px-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-300 text-center"
          >
            Request New Order
          </Link>
          <Link
            to="/customer/order-history"
            className="bg-green-600 text-white py-4 px-6 rounded-lg shadow-md hover:bg-green-700 transition duration-300 text-center"
          >
            View Order History
          </Link>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Recent Orders</h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {loading ? (
            <div className="flex justify-center">
              <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"></path>
              </svg>
            </div>
          ) : recentOrders.length === 0 ? (
            <p className="text-gray-600">No recent orders found.</p>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order._id} className="border-b pb-4">
                  <p className="text-gray-800 font-medium">Order ID: {order._id}</p>
                  <p className="text-gray-600">Status: {order.status}</p>
                  <p className="text-gray-600">Total: Rs. {order.totalPrice}</p>
                  <p className="text-gray-500 text-sm">Placed on: {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CustomerDashboard;