import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import ReactPaginate from 'react-paginate';
import Modal from 'react-modal';

// Bind modal to app element (for accessibility)
Modal.setAppElement('#root');

// Set Axios base URL
axios.defaults.baseURL = 'http://localhost:5000';

// Add token to Axios headers (if available)
const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({ name: '', description: '', price: '', stock: '', category: '', imageUrl: '' });
  const [formErrors, setFormErrors] = useState({});
  const [editProductId, setEditProductId] = useState(null);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const productsPerPage = 6;

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async (query = '') => {
    setLoading(true);
    try {
      const endpoint = query ? `/api/admin/products/search?query=${query}` : '/api/admin/products';
      const res = await axios.get(endpoint);
      setProducts(res.data);
      setError('');
    } catch (err) {
      setError('Error fetching products: ' + (err.response?.data?.error || err.message));
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const fetchProductById = async (id) => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/admin/products/${id}`);
      setSelectedProduct(res.data);
      setError('');
    } catch (err) {
      setError('Error fetching product details: ' + (err.response?.data?.error || err.message));
      toast.error('Failed to fetch product details');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Product name is required';
    if (!formData.price || formData.price <= 0) errors.price = 'Price must be a positive number';
    if (!formData.stock || formData.stock < 0) errors.stock = 'Stock must be a non-negative number';
    if (!formData.category.trim()) errors.category = 'Category is required';
    if (formData.imageUrl && !/^https?:\/\/.*\.(png|jpg|jpeg|gif)$/i.test(formData.imageUrl)) {
      errors.imageUrl = 'Please enter a valid image URL (png, jpg, jpeg, gif)';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const addProduct = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fix the form errors');
      return;
    }
    setLoading(true);

    const data = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      category: formData.category,
      imageUrl: formData.imageUrl || undefined,
    };

    try {
      if (editProductId) {
        await axios.put(`/api/admin/products/${editProductId}`, data);
        toast.success('Product updated successfully');
        setEditProductId(null);
        setIsEditModalOpen(false);
      } else {
        await axios.post('/api/admin/products', data);
        toast.success('Product added successfully');
        setIsAddModalOpen(false);
      }
      fetchProducts();
      resetForm();
    } catch (err) {
      setError((editProductId ? 'Error updating product: ' : 'Error adding product: ') + (err.response?.data?.error || err.message));
      toast.error(editProductId ? 'Failed to update product' : 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  const editProduct = (product) => {
    setEditProductId(product._id);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price || '',
      stock: product.stock || '',
      category: product.category || '',
      imageUrl: product.imageUrl || '',
    });
    setIsEditModalOpen(true);
  };

  const deleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setLoading(true);
      try {
        await axios.delete(`/api/admin/products/${id}`);
        fetchProducts();
        toast.success('Product deleted successfully');
        if (selectedProduct && selectedProduct._id === id) {
          setSelectedProduct(null);
        }
      } catch (err) {
        setError('Error deleting product: ' + (err.response?.data?.error || err.message));
        toast.error('Failed to delete product');
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', price: '', stock: '', category: '', imageUrl: '' });
    setFormErrors({});
    setEditProductId(null);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts(searchQuery);
  };

  // Pagination logic
  const pageCount = Math.ceil(products.length / productsPerPage);
  const offset = currentPage * productsPerPage;
  const currentProducts = products.slice(offset, offset + productsPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Toaster position="top-right" reverseOrder={false} />
      {error && <p className="text-red-500 mb-4 bg-red-50 p-3 rounded">{error}</p>}
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Products</h1>

      {/* Search Bar and Add Product Button */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search by name or category..."
            className="w-full sm:w-64 p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-blue-600 text-white p-3 rounded-lg shadow hover:bg-blue-700 transition-all duration-300 disabled:bg-blue-400 flex items-center gap-2"
              disabled={loading}
            >
              {loading && <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"></path>
              </svg>}
              Search
            </button>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                fetchProducts();
              }}
              className="bg-gray-500 text-white p-3 rounded-lg shadow hover:bg-gray-600 transition-all duration-300"
            >
              Clear
            </button>
          </div>
        </form>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-green-600 text-white p-3 rounded-lg shadow hover:bg-green-700 transition-all duration-300 flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Product
        </button>
      </div>

      {/* Add Product Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onRequestClose={() => {
          setIsAddModalOpen(false);
          resetForm();
        }}
        className="bg-white p-8 rounded-2xl shadow-2xl max-w-3xl mx-auto mt-30 transform transition-all duration-500"
        overlayClassName="fixed inset-0 bg-white bg-opacity-50 flex justify-center items-start"
      >
        <div className="relative">
          <button
            onClick={() => {
              setIsAddModalOpen(false);
              resetForm();
            }}
            className="absolute top-0 right-0 text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Add New Product
          </h2>
          <form onSubmit={addProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="name"
                    type="text"
                    placeholder="Enter product name"
                    className={`w-full p-3 pl-10 border ${formErrors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300`}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    aria-describedby={formErrors.name ? 'name-error' : undefined}
                  />
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12h18M3 6h18M3 18h18" />
                  </svg>
                </div>
                {formErrors.name && <p id="name-error" className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
              </div>
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Price (Rs.) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="price"
                    type="number"
                    placeholder="Enter price"
                    className={`w-full p-3 pl-10 border ${formErrors.price ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300`}
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    min="0"
                    step="0.01"
                    aria-describedby={formErrors.price ? 'price-error' : undefined}
                  />
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                {formErrors.price && <p id="price-error" className="text-red-500 text-sm mt-1">{formErrors.price}</p>}
              </div>
              <div>
                <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                  Stock Quantity <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="stock"
                    type="number"
                    placeholder="Enter stock quantity"
                    className={`w-full p-3 pl-10 border ${formErrors.stock ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300`}
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    required
                    min="0"
                    aria-describedby={formErrors.stock ? 'stock-error' : undefined}
                  />
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-2-3h-4l-2 3M6 7l-2-3H4l-2 3m4 0h12m-6 0v13m-6-6h12" />
                  </svg>
                </div>
                {formErrors.stock && <p id="stock-error" className="text-red-500 text-sm mt-1">{formErrors.stock}</p>}
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="category"
                    type="text"
                    placeholder="Enter category"
                    className={`w-full p-3 pl-10 border ${formErrors.category ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300`}
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                    aria-describedby={formErrors.category ? 'category-error' : undefined}
                  />
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7h18M3 12h18m-9 5h9" />
                  </svg>
                </div>
                {formErrors.category && <p id="category-error" className="text-red-500 text-sm mt-1">{formErrors.category}</p>}
              </div>
              <div>
                <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL (Optional)
                </label>
                <div className="relative">
                  <input
                    id="imageUrl"
                    type="text"
                    placeholder="Enter image URL (png, jpg, jpeg, gif)"
                    className={`w-full p-3 pl-10 border ${formErrors.imageUrl ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300`}
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    aria-describedby={formErrors.imageUrl ? 'imageUrl-error' : undefined}
                  />
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                {formErrors.imageUrl && <p id="imageUrl-error" className="text-red-500 text-sm mt-1">{formErrors.imageUrl}</p>}
                {formData.imageUrl && (
                  <div className="mt-3">
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-lg shadow-sm"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        toast.error('Invalid image URL');
                      }}
                      onLoad={(e) => (e.target.style.display = 'block')}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description (Optional)
              </label>
              <div className="relative">
                <textarea
                  id="description"
                  placeholder="Enter product description"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 resize-y"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="4"
                />
                <svg className="absolute left-3 top-5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
            </div>
            <div className="md:col-span-2 flex gap-3 mt-4">
              <button
                type="submit"
                className="bg-green-600 text-white p-3 rounded-lg shadow-lg hover:bg-green-700 transition-all duration-300 disabled:bg-green-400 flex items-center gap-2 transform hover:scale-105"
                disabled={loading}
              >
                {loading && <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"></path>
                </svg>}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Add Product
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAddModalOpen(false);
                  resetForm();
                }}
                className="bg-gray-500 text-white p-3 rounded-lg shadow-lg hover:bg-gray-600 transition-all duration-300 flex items-center gap-2 transform hover:scale-105"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Edit Product Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onRequestClose={() => {
          setIsEditModalOpen(false);
          resetForm();
        }}
        className="bg-white p-8 rounded-2xl shadow-2xl max-w-3xl mx-auto mt-16 transform transition-all duration-500"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start"
      >
        <div className="relative">
          <button
            onClick={() => {
              setIsEditModalOpen(false);
              resetForm();
            }}
            className="absolute top-0 right-0 text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Update Product
          </h2>
          <form onSubmit={addProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="name"
                    type="text"
                    placeholder="Enter product name"
                    className={`w-full p-3 pl-10 border ${formErrors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300`}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    aria-describedby={formErrors.name ? 'name-error' : undefined}
                  />
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12h18M3 6h18M3 18h18" />
                  </svg>
                </div>
                {formErrors.name && <p id="name-error" className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
              </div>
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Price (Rs.) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="price"
                    type="number"
                    placeholder="Enter price"
                    className={`w-full p-3 pl-10 border ${formErrors.price ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300`}
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    min="0"
                    step="0.01"
                    aria-describedby={formErrors.price ? 'price-error' : undefined}
                  />
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                {formErrors.price && <p id="price-error" className="text-red-500 text-sm mt-1">{formErrors.price}</p>}
              </div>
              <div>
                <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                  Stock Quantity <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="stock"
                    type="number"
                    placeholder="Enter stock quantity"
                    className={`w-full p-3 pl-10 border ${formErrors.stock ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300`}
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    required
                    min="0"
                    aria-describedby={formErrors.stock ? 'stock-error' : undefined}
                  />
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-2-3h-4l-2 3M6 7l-2-3H4l-2 3m4 0h12m-6 0v13m-6-6h12" />
                  </svg>
                </div>
                {formErrors.stock && <p id="stock-error" className="text-red-500 text-sm mt-1">{formErrors.stock}</p>}
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="category"
                    type="text"
                    placeholder="Enter category"
                    className={`w-full p-3 pl-10 border ${formErrors.category ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300`}
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                    aria-describedby={formErrors.category ? 'category-error' : undefined}
                  />
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7h18M3 12h18m-9 5h9" />
                  </svg>
                </div>
                {formErrors.category && <p id="category-error" className="text-red-500 text-sm mt-1">{formErrors.category}</p>}
              </div>
              <div>
                <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL (Optional)
                </label>
                <div className="relative">
                  <input
                    id="imageUrl"
                    type="text"
                    placeholder="Enter image URL (png, jpg, jpeg, gif)"
                    className={`w-full p-3 pl-10 border ${formErrors.imageUrl ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300`}
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    aria-describedby={formErrors.imageUrl ? 'imageUrl-error' : undefined}
                  />
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                {formErrors.imageUrl && <p id="imageUrl-error" className="text-red-500 text-sm mt-1">{formErrors.imageUrl}</p>}
                {formData.imageUrl && (
                  <div className="mt-3">
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-lg shadow-sm"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        toast.error('Invalid image URL');
                      }}
                      onLoad={(e) => (e.target.style.display = 'block')}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description (Optional)
              </label>
              <div className="relative">
                <textarea
                  id="description"
                  placeholder="Enter product description"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 resize-y"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="4"
                />
                <svg className="absolute left-3 top-5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
            </div>
            <div className="md:col-span-2 flex gap-3 mt-4">
              <button
                type="submit"
                className="bg-blue-600 text-white p-3 rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300 disabled:bg-blue-400 flex items-center gap-2 transform hover:scale-105"
                disabled={loading}
              >
                {loading && <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"></path>
                </svg>}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Update Product
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditModalOpen(false);
                  resetForm();
                }}
                className="bg-gray-500 text-white p-3 rounded-lg shadow-lg hover:bg-gray-600 transition-all duration-300 flex items-center gap-2 transform hover:scale-105"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Selected Product Details Modal */}
      {selectedProduct && (
        <Modal
          isOpen={!!selectedProduct}
          onRequestClose={() => setSelectedProduct(null)}
          className="bg-white p-8 rounded-2xl shadow-2xl max-w-2xl mx-auto mt-30 transform transition-all duration-500"
          overlayClassName="fixed inset-0 bg-white bg-opacity-50 flex justify-center items-start"
        >
          <div className="relative">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-0 right-0 text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01m-.01 4h.01" />
              </svg>
              Product Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-3">
                <p className="text-gray-700"><strong className="font-semibold">Name:</strong> {selectedProduct.name}</p>
                <p className="text-gray-700"><strong className="font-semibold">Description:</strong> {selectedProduct.description || 'N/A'}</p>
                <p className="text-gray-700"><strong className="font-semibold">Price:</strong> Rs.{selectedProduct.price}</p>
                <p className="text-gray-700"><strong className="font-semibold">Stock:</strong> {selectedProduct.stock}</p>
                <p className="text-gray-700"><strong className="font-semibold">Category:</strong> {selectedProduct.category}</p>
                <p className="text-gray-700"><strong className="font-semibold">Created At:</strong> {new Date(selectedProduct.createdAt).toLocaleDateString()}</p>
              </div>
              {selectedProduct.imageUrl && (
                <div className="flex justify-center">
                  <img src={selectedProduct.imageUrl} alt={selectedProduct.name} className="w-48 h-48 object-cover rounded-lg shadow-sm" />
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* Product List in Card View */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"></path>
          </svg>
        </div>
      ) : products.length === 0 ? (
        <p className="text-gray-600 text-center">No products found.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentProducts.map(product => (
              <div key={product._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300">
                <div className="h-48 w-full">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <span className="text-gray-500">No Image</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                  <p className="text-gray-600 text-sm truncate">{product.description || 'N/A'}</p>
                  <p className="text-blue-600 font-bold mt-1">Rs.{product.price}</p>
                  <p className="text-gray-600 text-sm">Stock: {product.stock}</p>
                  <p className="text-gray-600 text-sm">Category: {product.category}</p>
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => fetchProductById(product._id)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-all duration-300 text-sm flex items-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View
                    </button>
                    <button
                      onClick={() => editProduct(product)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition-all duration-300 text-sm flex items-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </button>
                    <button
                      onClick={() => deleteProduct(product._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-all duration-300 text-sm flex items-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4M3 7h18" />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Pagination */}
          {pageCount > 1 && (
            <div className="mt-6">
              <ReactPaginate
                previousLabel={'← Previous'}
                nextLabel={'Next →'}
                pageCount={pageCount}
                onPageChange={handlePageClick}
                containerClassName={'flex justify-center gap-2 mt-4'}
                pageClassName={'px-3 py-1 rounded-lg border border-gray-300 hover:bg-gray-200 transition-all duration-300'}
                activeClassName={'bg-blue-600 text-white border-blue-600'}
                previousClassName={'px-3 py-1 rounded-lg border border-gray-300 hover:bg-gray-200 transition-all duration-300'}
                nextClassName={'px-3 py-1 rounded-lg border border-gray-300 hover:bg-gray-200 transition-all duration-300'}
                disabledClassName={'opacity-50 cursor-not-allowed'}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ManageProducts;