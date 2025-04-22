import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from "../customer/auth/AuthContext";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const { token } = useContext(AuthContext);
  const API = import.meta.env.VITE_API_BASE_URL;

  const fetchCart = async () => {
    if (!token) return;
    
    try {
      const response = await axios.get(`${API}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const items = response.data.cart || [];
      setCartItems(items);
      setCartCount(items.length);
    } catch (err) {
      console.error('Error fetching cart:', err);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      await axios.post(
        `${API}/cart`,
        { productId, quantity },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // After adding to cart, refresh the cart data
      fetchCart();
      return true;
    } catch (err) {
      console.error('Error adding to cart:', err);
      return false;
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      await axios.delete(`${API}/cart/remove/${itemId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // After removing from cart, refresh the cart data
      fetchCart();
      return true;
    } catch (err) {
      console.error('Error removing from cart:', err);
      return false;
    }
  };

  const updateCartItemQuantity = async (itemId, quantity) => {
    try {
      await axios.put(
        `${API}/cart/update/${itemId}`,
        { quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // After updating quantity, refresh the cart data
      fetchCart();
      return true;
    } catch (err) {
      console.error('Error updating cart quantity:', err);
      return false;
    }
  };

  // Fetch cart data when component mounts or token changes
  useEffect(() => {
    fetchCart();
  }, [token]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        fetchCart,
        addToCart,
        removeFromCart,
        updateCartItemQuantity
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Hook to use cart context
export const useCart = () => {
  return useContext(CartContext);
};