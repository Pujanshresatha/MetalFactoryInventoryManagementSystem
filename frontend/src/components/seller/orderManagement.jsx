import React, { useState, useEffect } from 'react';
import { useAuth } from '../customer/auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Eye, CheckCircle } from 'lucide-react';

const OrderManagement = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('new'); // Tabs: new, pending, completed
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

  // Redirect non-sellers or unauthenticated users
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role.toLowerCase() !== 'seller') {
      navigate('/');
    }
  }, [user, navigate]);

  // Fetch orders based on active tab
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const response = await fetch(
          `${API_URL}/orders?sellerId=${user._id}&status=${activeTab}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }
        );
        if (!response.ok) {
          if (response.status === 401) {
            logout();
            return;
          }
          throw new Error('Failed to fetch orders');
        }
        const data = await response.json();
        setOrders(data);
        setError(null);
      } catch (err) {
        setError('Unable to load orders. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user, activeTab, logout]);

  // Update order status
  const handleUpdateStatus = async (orderId, status) => {
    try {
      const response = await fetch(`${API_URL}/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) {
        if (response.status === 401) {
          logout();
          return;
        }
        throw new Error('Failed to update order status');
      }
      const updatedOrder = await response.json();
      setOrders(orders.map((o) => (o._id === updatedOrder._id ? updatedOrder : o)));
      setSelectedOrderId(null);
      setNewStatus('');
      setError(null);
    } catch (err) {
      setError('Failed to update order status. Please try again.');
      console.error(err);
    }
  };

  // View order details
  const handleViewOrder = (orderId) => {
    navigate(`/seller/order-management/${orderId}`);
  };

  const tabs = [
    { id: 'new', label: 'New Orders' },
    { id: 'pending', label: 'Pending Orders' },
    { id: 'completed', label: 'Completed Orders' },
  ];

  const statusOptions = ['new', 'pending', 'completed', 'cancelled'];

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Order Management</h2>
        <button
          onClick={() => navigate('/seller/dashboard')}
          className="text-blue-500 hover:text-blue-700"
        >
          Back to Dashboard
        </button>
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex space-x-4 border-b">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`p-2 font-medium ${
                activeTab === tab.id
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">
          {tabs.find((tab) => tab.id === activeTab)?.label}
        </h3>
        <div className="overflow-x-auto">
          {loading ? (
            <p>Loading orders...</p>
          ) : (
            <table className="min-w-full border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border text-left">Order ID</th>
                  <th className="p-2 border text-left">Customer</th>
                  <th className="p-2 border text-left">Status</th>
                  <th className="p-2 border text-left">Total</th>
                  <th className="p-2 border text-left">Date</th>
                  <th className="p-2 border text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-2 text-center text-gray-500">
                      No orders found
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="p-2 border">{order._id}</td>
                      <td className="p-2 border">{order.customer?.username || 'N/A'}</td>
                      <td className="p-2 border">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            order.status === 'new'
                              ? 'bg-yellow-100 text-yellow-800'
                              : order.status === 'pending'
                              ? 'bg-blue-100 text-blue-800'
                              : order.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="p-2 border">${order.total.toFixed(2)}</td>
                      <td className="p-2 border">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-2 border flex space-x-2">
                        <button
                          onClick={() => handleViewOrder(order._id)}
                          className="text-blue-500 hover:text-blue-700"
                          title="View Order"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <select
                          value={selectedOrderId === order._id ? newStatus : ''}
                          onChange={(e) => {
                            setSelectedOrderId(order._id);
                            setNewStatus(e.target.value);
                            if (e.target.value) {
                              handleUpdateStatus(order._id, e.target.value);
                            }
                          }}
                          className="border rounded p-1 text-sm"
                        >
                          <option value="">Update Status</option>
                          {statusOptions.map((status) => (
                            <option key={status} value={status}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderManagement;