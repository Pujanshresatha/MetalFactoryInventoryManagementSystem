import React, { useState, useEffect } from 'react';
import { useCart } from '../cart/CartContext';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, error } = useCart();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (cartItems) setLoading(false);
  }, [cartItems]);

  if (loading) return <p className="text-center p-4">Loading cart...</p>;
  if (error) return <p className="text-red-500 text-center p-4">{error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
      {cartItems.length === 0 ? (
        <p className="text-gray-600">Your cart is empty</p>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div key={item._id} className="flex justify-between items-center p-2 border-b">
              <span className="text-lg">{item.product?.name || 'Unknown Product'}</span>
              <div className="flex items-center space-x-4">
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item._id, Number(e.target.value))}
                  className="w-16 p-1 border rounded"
                  min="1"
                />
                <button
                  onClick={() => removeFromCart(item._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <button className="bg-blue-500 text-white p-2 mt-4 rounded hover:bg-blue-600">
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;