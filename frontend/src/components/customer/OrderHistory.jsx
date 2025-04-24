import React, { useState, useEffect } from 'react';
import axios from 'axios';

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/api/customer/orders', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setOrders(response.data);
        setError('');
      } catch (err) {
        setError('Error fetching orders: ' + (err.response?.data?.error || err.message));
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Order History</h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {loading ? (
            <div className="flex justify-center">
              <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"></path>
              </svg>
            </div>
          ) : orders.length === 0 ? (
            <p className="text-gray-600">No orders found.</p>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order._id} className="border-b pb-4">
                  <p className="text-gray-800 font-medium">Order ID: {order._id}</p>
                  <p className="text-gray-600">Status: {order.status}</p>
                  <p className="text-gray-600">Total: Rs. {order.totalPrice}</p>
                  <p className="text-gray-500 text-sm">Placed on: {new Date(order.createdAt).toLocaleDateString()}</p>
                  <div className="mt-2">
                    <p className="text-gray-700 font-medium">Items:</p>
                    <ul className="list-disc list-inside text-gray-600">
                      {order.items.map((item, index) => (
                        <li key={index}>
                          {item.productName} - Quantity: {item.quantity} - Rs. {item.price}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default OrderHistory;