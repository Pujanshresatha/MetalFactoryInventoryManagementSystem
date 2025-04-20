import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './auth/AuthContext';

function CustomerDashboard() {
  const { logout, token } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchCart();
    fetchOrders();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('/api/products', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(res.data);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  const fetchCart = async () => {
    try {
      const res = await axios.get('/api/cart', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart(res.data.items);
    } catch (err) {
      console.error('Error fetching cart:', err);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get('/api/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data);
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  };

  const addToCart = async (productId) => {
    try {
      await axios.post('/api/cart', { productId, quantity: 1 }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCart();
    } catch (err) {
      console.error('Error adding to cart:', err);
    }
  };

  const placeOrder = async () => {
    try {
      await axios.post('/api/orders', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCart();
      fetchOrders();
    } catch (err) {
      console.error('Error placing order:', err);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between">
        <h1 className="text-2xl">Customer Dashboard</h1>
        <button onClick={logout} className="bg-red-500 text-white p-2 rounded">Logout</button>
      </div>
      <h2 className="text-xl mt-4">Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
        {products.map(product => (
          <div key={product._id} className="p-4 border rounded">
            <h3 className="font-bold">{product.name}</h3>
            <p className="text-sm">{product.description}</p>
            <p>Price: ${product.price}</p>
            <button
              onClick={() => addToCart(product._id)}
              className="bg-blue-500 text-white p-2 rounded mt-2"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div>
          <h2 className="text-xl mt-4">Cart</h2>
          <div className="border rounded p-4">
            {cart.length === 0 ? (
              <p>Your cart is empty</p>
            ) : (
              <>
                {cart.map(item => (
                  <div key={item._id} className="p-2 border-b">
                    <p>{item.product.name} - Quantity: {item.quantity}</p>
                  </div>
                ))}
                <button
                  onClick={placeOrder}
                  className="bg-green-500 text-white p-2 rounded mt-2"
                  disabled={cart.length === 0}
                >
                  Place Order
                </button>
              </>
            )}
          </div>
        </div>
        <div>
          <h2 className="text-xl mt-4">Orders</h2>
          <div className="border rounded p-4">
            {orders.length === 0 ? (
              <p>No orders yet</p>
            ) : (
              <>
                {orders.map(order => (
                  <div key={order._id} className="p-2 border-b">
                    <p>Order #{order._id} - Status: {order.status}</p>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerDashboard;