import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch cart from backend on initial load
  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/customer/cart', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCart(response.data.items || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching cart:', err.response?.data?.message || err.message);
        setCart([]);
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  // Save cart to backend
  const saveCartToBackend = async (updatedCart) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/customer/cart',
        { items: updatedCart },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (err) {
      console.error('Error saving cart:', err.response?.data?.message || err.message);
    }
  };

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item._id === product._id);
      let updatedCart;
      if (existingProduct) {
        updatedCart = prevCart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + product.quantity }
            : item
        );
      } else {
        updatedCart = [...prevCart, product];
      }
      saveCartToBackend(updatedCart); // Save to backend
      return updatedCart;
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.filter((item) => item._id !== productId);
      saveCartToBackend(updatedCart); // Save to backend
      return updatedCart;
    });
  };

  const createOrder = async () => {
    const token = localStorage.getItem('token');
    const orderData = {
      products: cart.map((item) => ({
        productId: item._id,
        quantity: item.quantity,
      })),
      totalAmount: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    };

    try {
      const response = await axios.post(
        'http://localhost:5000/api/customer/orders',
        orderData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const updatedCart = []; // Clear the cart
      setCart(updatedCart);
      saveCartToBackend(updatedCart); // Save empty cart to backend
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to create order');
    }
  };

  const cartCount = cart.length;

  return (
    <CartContext.Provider value={{ cart, cartCount, addToCart, removeFromCart, createOrder, loading }}>
      {children}
    </CartContext.Provider>
  );
};

// Add this export to make useCart work
export const useCart = () => {
  return useContext(CartContext);
};
