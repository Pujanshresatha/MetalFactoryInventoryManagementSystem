// import React, { useState, useEffect, useContext } from 'react';
// import { Link } from 'react-router-dom';
// import axios from 'axios';
// import { AuthContext } from './auth/AuthContext';

// function CustomerDashboard() {
//   const { logout, token } = useContext(AuthContext);
//   const [products, setProducts] = useState([]);
//   const [orders, setOrders] = useState([]);

//   useEffect(() => {
//     fetchProducts();
//     fetchOrders();
//   }, []);

//   const fetchProducts = async () => {
//     try {
//       const res = await axios.get('/api/products', {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setProducts(res.data);
//     } catch (err) {
//       console.error('Error fetching products:', err);
//     }
//   };

//   const fetchOrders = async () => {
//     try {
//       const res = await axios.get('/api/orders', {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setOrders(res.data);
//     } catch (err) {
//       console.error('Error fetching orders:', err);
//     }
//   };

//   const addToCart = async (productId) => {
//     try {
//       await axios.post(
//         '/api/cart',
//         { productId, quantity: 1 },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//     } catch (err) {
//       console.error('Error adding to cart:', err);
//     }
//   };

//   return (
//     <div className="container mx-auto px-4 py-8 max-w-4xl bg-gray-100 min-h-screen">
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-3xl font-bold text-gray-800">Customer Dashboard</h1>
//         <div className="flex space-x-4">
//           <Link
//             to="/cart"
//             className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 font-medium"
//           >
//             My Cart
//           </Link>
//           <button
//             onClick={logout}
//             className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-300 font-medium"
//           >
//             Logout
//           </button>
//         </div>
//       </div>

//       {/* Products Section */}
//       <h2 className="text-xl font-semibold text-gray-800 mt-4">Products</h2>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
//         {products.map((product) => (
//           <div key={product._id} className="p-4 border rounded-lg bg-white shadow-sm">
//             <h3 className="font-bold text-lg text-gray-800">{product.name}</h3>
//             <p className="text-sm text-gray-600">{product.description}</p>
//             <p className="text-gray-800 font-medium">Price: ${product.price}</p>
//             <button
//               onClick={() => addToCart(product._id)}
//               className="bg-blue-600 text-white py-2 px-4 rounded-lg mt-2 hover:bg-blue-700 transition duration-300 font-medium"
//             >
//               Add to Cart
//             </button>
//           </div>
//         ))}
//       </div>

//       {/* Orders Section */}
//       <h2 className="text-xl font-semibold text-gray-800 mt-8">Orders</h2>
//       <div className="bg-white rounded-lg shadow-md p-6 mt-2">
//         {orders.length === 0 ? (
//           <p className="text-gray-600">No orders yet</p>
//         ) : (
//           orders.map((order) => (
//             <div key={order._id} className="p-2 border-b border-gray-200">
//               <p className="text-gray-800">
//                 Order #{order._id} - Status: {order.status}
//               </p>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }

// export default CustomerDashboard;

import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from './auth/AuthContext';
import { useCart } from "../cart/CartContext";
// Import the cart context

function CustomerDashboard() {
  const { logout, token } = useContext(AuthContext);
  const { addToCart } = useCart(); // Use the cart context
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [addingToCart, setAddingToCart] = useState(null); // Track which product is being added

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('/api/products', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get('/api/orders', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  };

  const handleAddToCart = async (productId) => {
    setAddingToCart(productId); // Set loading state for this product
    
    try {
      const success = await addToCart(productId, 1);
      if (success) {
        // Show a brief success indicator or tooltip here if desired
      }
    } catch (err) {
      console.error('Error adding to cart:', err);
    } finally {
      // After a brief delay, reset the loading state
      setTimeout(() => {
        setAddingToCart(null);
      }, 1000);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Customer Dashboard</h1>
        <div className="flex space-x-4">
          <Link
            to="/cart"
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 font-medium"
          >
            My Cart
          </Link>
          <button
            onClick={logout}
            className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-300 font-medium"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Products Section */}
      <h2 className="text-xl font-semibold text-gray-800 mt-4">Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
        {products.map((product) => (
          <div key={product._id} className="p-4 border rounded-lg bg-white shadow-sm">
            <h3 className="font-bold text-lg text-gray-800">{product.name}</h3>
            <p className="text-sm text-gray-600">{product.description}</p>
            <p className="text-gray-800 font-medium">Price: ${product.price}</p>
            <button
              onClick={() => handleAddToCart(product._id)}
              className={`bg-blue-600 text-white py-2 px-4 rounded-lg mt-2 hover:bg-blue-700 transition duration-300 font-medium flex items-center justify-center w-full ${
                addingToCart === product._id ? 'opacity-75' : ''
              }`}
              disabled={addingToCart === product._id}
            >
              {addingToCart === product._id ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Adding...
                </>
              ) : (
                'Add to Cart'
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Orders Section */}
      <h2 className="text-xl font-semibold text-gray-800 mt-8">Orders</h2>
      <div className="bg-white rounded-lg shadow-md p-6 mt-2">
        {orders.length === 0 ? (
          <p className="text-gray-600">No orders yet</p>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="p-2 border-b border-gray-200">
              <p className="text-gray-800">
                Order #{order._id} - Status: {order.status}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default CustomerDashboard;