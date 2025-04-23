import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch(`${API_URL}/orders/cart`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch cart: ${response.statusText}`);
        }
        const data = await response.json();
        setCartItems(data || []);
        setError(null);
      } catch (err) {
        setError('Unable to connect to the server. Please try again later.');
        console.error('Fetch error:', err);
      }
    };
    fetchCart();
  }, []);

  // Other cart functions (addToCart, updateQuantity, etc.) remain unchanged

  return (
    <CartContext.Provider value={{ cartItems, error /* other values */ }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};