import React, { useContext, useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import { AuthContext } from '../customer/auth/AuthContext';
import axios from 'axios';

const API = import.meta.env.VITE_API_BASE_URL;

function Cart() {
  const { user } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchCart = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API}/cart`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setCartItems(response.data.cart || []);
    } catch (err) {
      setError('Failed to load cart items');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleQuantityChange = async (id, delta) => {
    const updatedItems = cartItems.map((item) =>
      item._id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    );
    setCartItems(updatedItems);

    try {
      await axios.put(
        `${API}/cart/update/${id}`,
        { quantity: updatedItems.find((i) => i._id === id).quantity },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
    } catch (err) {
      setError('Failed to update quantity');
    }
  };

  const handleRemoveItem = async (id) => {
    try {
      await axios.delete(`${API}/cart/remove/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setCartItems(cartItems.filter((item) => item._id !== id));
    } catch (err) {
      setError('Failed to remove item');
    }
  };

  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2);

  const handleCheckout = () => {
    // Navigate to checkout page or trigger checkout logic
    setMessage('Proceeding to checkout...');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-xl p-8 space-y-8">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center">Your Cart</h2>

        {message && (
          <div className="p-4 bg-green-50 text-green-800 rounded-lg border border-green-200 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            {message}
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 text-red-800 rounded-lg border border-red-200 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            {error}
          </div>
        )}

        {cartItems.length === 0 ? (
          <p className="text-center text-gray-500">Your cart is empty.</p>
        ) : (
          <div className="space-y-6">
            {cartItems.map((item) => (
              <div key={item._id} className="flex justify-between items-center border-b pb-4">
                <div>
                  <h4 className="text-lg font-semibold">{item.name}</h4>
                  <p className="text-sm text-gray-500">Rs. {item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleQuantityChange(item._id, -1)}
                    className="text-gray-700 px-2 py-1 bg-gray-200 rounded"
                  >
                    −
                  </button>
                  <span className="px-2">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item._id, 1)}
                    className="text-gray-700 px-2 py-1 bg-gray-200 rounded"
                  >
                    +
                  </button>
                  <button onClick={() => handleRemoveItem(item._id)} className="text-red-600 hover:text-red-800">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}

            <div className="flex justify-between items-center pt-4 border-t">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-lg font-bold text-indigo-600">Rs. {totalPrice}</span>
            </div>

            <button
              onClick={handleCheckout}
              className={`w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-150 ease-in-out ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Proceed to Checkout'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
