import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../customer/auth/AuthContext';

function AdminDashboard() {
  const { logout, token } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ name: '', description: '', price: '', stock: '', category: '' });

  useEffect(() => {
    fetchProducts();
    fetchUsers();
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

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const addProduct = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/products', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProducts();
      setFormData({ name: '', description: '', price: '', stock: '', category: '' });
    } catch (err) {
      console.error('Error adding product:', err);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between">
        <h1 className="text-2xl">Admin Dashboard</h1>
        <button onClick={logout} className="bg-red-500 text-white p-2 rounded">Logout</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div>
          <h2 className="text-xl mb-2">Add Product</h2>
          <form onSubmit={addProduct}>
            <input
              type="text"
              placeholder="Name"
              className="w-full p-2 mb-2 border rounded"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <textarea
              placeholder="Description"
              className="w-full p-2 mb-2 border rounded"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Price"
              className="w-full p-2 mb-2 border rounded"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Stock"
              className="w-full p-2 mb-2 border rounded"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Category"
              className="w-full p-2 mb-2 border rounded"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
            />
            <button type="submit" className="bg-blue-500 text-white p-2 rounded">Add Product</button>
          </form>
        </div>
        <div>
          <h2 className="text-xl mb-2">Users</h2>
          <div className="max-h-96 overflow-y-auto">
            <ul>
              {users.map(user => (
                <li key={user._id} className="p-2 border-b">{user.name} - {user.role}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <h2 className="text-xl mt-4">Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
        {products.map(product => (
          <div key={product._id} className="p-4 border rounded">
            <h3 className="font-bold">{product.name}</h3>
            <p className="text-sm">{product.description}</p>
            <p>Price: ${product.price}</p>
            <p>Stock: {product.stock}</p>
            <p>Category: {product.category}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;