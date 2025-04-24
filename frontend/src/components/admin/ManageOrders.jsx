import React, { useState, useEffect } from 'react';

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all customer orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/orders', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      const data = await response.json();
      setOrders(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Fetch orders initially and set up polling
  useEffect(() => {
    fetchOrders(); // Initial fetch

    // Polling: Fetch orders every 10 seconds
    const interval = setInterval(fetchOrders, 10000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  // Handle updating order status
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      const updatedOrder = await response.json();
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
      alert(updatedOrder.message);
      fetchOrders(); // Refresh orders after updating status
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  if (loading) return <div className="text-center text-gray-500">Loading...</div>;
  if (error) return <div className="text-center text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 text-center">Manage Orders</h1>
        <button
          onClick={fetchOrders}
          className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300"
        >
          Refresh Orders
        </button>
      </div>
      {orders.length === 0 ? (
        <div className="text-center text-gray-500">No orders found.</div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold text-gray-800">Order ID: {order._id}</h2>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    order.status === 'Pending'
                      ? 'bg-yellow-200 text-yellow-800'
                      : order.status === 'Processing'
                      ? 'bg-blue-200 text-blue-800'
                      : order.status === 'Shipped'
                      ? 'bg-green-200 text-green-800'
                      : order.status === 'Delivered'
                      ? 'bg-gray-200 text-gray-800'
                      : 'bg-red-200 text-red-800'
                  }`}
                >
                  {order.status}
                </span>
              </div>
              <p className="text-gray-600 mb-2">
                Customer: {order.customer?.username || 'Unknown'}
              </p>
              <p className="text-gray-600 mb-2">Total: Rs. {order.totalAmount}</p>
              <div className="mb-2">
                <h3 className="text-gray-700 font-semibold">Products:</h3>
                <ul className="space-y-2">
                  {order.products.map((item) => (
                    <li key={item.productId?._id} className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-lg overflow-hidden">
                        {item.productId?.imageUrl ? (
                          <img
                            src={item.productId.imageUrl}
                            alt={item.productId.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/48'; // Fallback image
                            }}
                          />
                        ) : (
                          <span className="text-gray-500 text-sm">No Image</span>
                        )}
                      </div>
                      <div>
                        <p className="text-gray-600">
                          {item.productId?.name || 'Unknown Product'} - Quantity: {item.quantity}
                        </p>
                        <p className="text-gray-600">
                          Price: Rs. {item.productId?.price || 0}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex space-x-2">
                {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                  <>
                    <button
                      onClick={() =>
                        handleUpdateStatus(
                          order._id,
                          order.status === 'Pending'
                            ? 'Processing'
                            : order.status === 'Processing'
                            ? 'Shipped'
                            : 'Delivered'
                        )
                      }
                      className="bg-blue-600 text-white py-1 px-3 rounded-lg hover:bg-blue-700 transition-colors duration-300"
                    >
                      {order.status === 'Pending'
                        ? 'Mark as Processing'
                        : order.status === 'Processing'
                        ? 'Mark as Shipped'
                        : 'Mark as Delivered'}
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(order._id, 'Cancelled')}
                      className="bg-red-600 text-white py-1 px-3 rounded-lg hover:bg-red-700 transition-colors duration-300"
                    >
                      Cancel Order
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageOrders;