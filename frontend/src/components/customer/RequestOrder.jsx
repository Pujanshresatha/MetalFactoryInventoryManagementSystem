import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { CartContext } from './CartContext.jsx'; // Updated path
import { toast } from 'react-toastify';

const RequestOrder = () => {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/products');
        setProducts(response.data);
        // Initialize quantities for each product
        const initialQuantities = response.data.reduce((acc, product) => {
          acc[product._id] = 1;
          return acc;
        }, {});
        setQuantities(initialQuantities);
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };

    fetchProducts();
  }, []);

  const handleQuantityChange = (productId, value) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(1, value),
    }));
  };

  const handleAddToCart = (product) => {
    const quantity = quantities[product._id] || 1;
    addToCart({ ...product, quantity });
    toast.success(`${product.name} (x${quantity}) added to cart!`);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Request Order</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product._id} className="bg-white p-4 rounded-lg shadow-md">
            <div className="w-full h-48 rounded-lg overflow-hidden mb-4">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/150'; // Fallback image
                  }}
                />
              ) : (
                <span className="text-gray-500 text-sm">No Image</span>
              )}
            </div>
            <h2 className="text-lg font-semibold text-gray-800">{product.name}</h2>
            <p className="text-gray-600 mb-2">Price: Rs. {product.price}</p>
            <p className="text-gray-600 mb-4">Stock: {product.quantity}</p>
            <div className="flex items-center space-x-2 mb-4">
              <label htmlFor={`quantity-${product._id}`} className="text-gray-600">
                Quantity:
              </label>
              <input
                type="number"
                id={`quantity-${product._id}`}
                value={quantities[product._id] || 1}
                onChange={(e) => handleQuantityChange(product._id, parseInt(e.target.value))}
                min="1"
                className="w-16 p-1 border rounded-lg text-center"
              />
            </div>
            <button
              onClick={() => handleAddToCart(product)}
              className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300 w-full"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RequestOrder;