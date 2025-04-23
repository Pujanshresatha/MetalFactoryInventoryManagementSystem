import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../customer/auth/AuthContext';
import { Plus, Eye } from 'lucide-react';

const SellerDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({ totalProducts: 0, totalOrders: 0, totalRevenue: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

  // Redirect non-sellers or unauthenticated users
  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (user.role?.toLowerCase() !== 'seller') {
      navigate('/');
    }
  }, [user, navigate]);

  // Fetch dashboard data
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      setLoading(true);
      try {
        const token = localStorage.getItem('token');

        // Stats fetch
        const statsRes = await fetch(`${API_URL}/seller/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (statsRes.status === 401) {
          logout();
          return;
        }

        if (!statsRes.ok) throw new Error('Failed to fetch stats');
        const statsData = await statsRes.json();
        setStats(statsData);

        // Orders fetch
        const ordersRes = await fetch(`${API_URL}/orders?sellerId=${user._id}&limit=5`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (ordersRes.status === 401) {
          logout();
          return;
        }

        if (!ordersRes.ok) throw new Error('Failed to fetch orders');
        const ordersData = await ordersRes.json();
        setRecentOrders(ordersData);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Unable to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, logout, API_URL]);

  const handleViewOrder = (orderId) => navigate(`/seller/order-management/${orderId}`);
  const handleManageProducts = () => navigate('/seller/product-management');
  const handleManageOrders = () => navigate('/seller/order-management');

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Seller Dashboard</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {loading ? (
        <p className="text-center text-gray-500">Loading dashboard...</p>
      ) : (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'Total Products', value: stats.totalProducts },
              { label: 'Total Orders', value: stats.totalOrders },
              { label: 'Total Revenue', value: `$${stats.totalRevenue.toFixed(2)}` },
            ].map((item, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-700">{item.label}</h3>
                <p className="text-3xl font-bold text-blue-600">{item.value}</p>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="flex space-x-4">
            <button
              onClick={handleManageProducts}
              className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Manage Products
            </button>
            <button
              onClick={handleManageOrders}
              className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 flex items-center"
            >
              <Eye className="w-5 h-5 mr-2" />
              Manage Orders
            </button>
          </div>

          {/* Recent Orders Table */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
            <div className="overflow-x-auto">
              {recentOrders.length === 0 ? (
                <p className="text-center text-gray-500">No recent orders found</p>
              ) : (
                <table className="min-w-full border">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-2 border text-left">Order ID</th>
                      <th className="p-2 border text-left">Customer</th>
                      <th className="p-2 border text-left">Status</th>
                      <th className="p-2 border text-left">Total</th>
                      <th className="p-2 border text-left">Date</th>
                      <th className="p-2 border text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order._id} className="hover:bg-gray-50">
                        <td className="p-2 border">{order._id}</td>
                        <td className="p-2 border">{order.customer?.username || 'N/A'}</td>
                        <td className="p-2 border">{order.status}</td>
                        <td className="p-2 border">${order.total.toFixed(2)}</td>
                        <td className="p-2 border">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-2 border">
                          <button
                            onClick={() => handleViewOrder(order._id)}
                            className="text-blue-500 hover:text-blue-700"
                            title="View Order"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerDashboard;
