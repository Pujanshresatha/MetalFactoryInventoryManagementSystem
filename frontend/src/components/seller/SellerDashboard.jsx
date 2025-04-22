import React, { useState, useEffect, useMemo, useCallback, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Trash2, Edit, Plus, Package, ShoppingCart, BarChart2, Eye, AlertCircle } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import debounce from 'lodash/debounce';
import PropTypes from 'prop-types';
import { AuthContext } from '../customer/auth/AuthContext';
// import NavBar from '../NavBar';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <div className="p-4 text-red-600">Something went wrong. Please try again.</div>;
    }
    return this.props.children;
  }
}

// Reusable Stat Card Component
const StatCard = ({ title, value, icon, color }) => (
  <div className={`bg-white shadow-sm rounded-lg p-6 border-l-4 ${color}`}>
    <div className="flex items-center">
      <div className="p-3 rounded-full bg-opacity-10 text-opacity-60">{icon}</div>
      <div className="ml-5">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  </div>
);

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  icon: PropTypes.node.isRequired,
  color: PropTypes.string.isRequired,
};

const SellerDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState({
    products: false,
    orders: false,
    inventory: false,
  });
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    lowStockItems: 0,
  });
  const [error, setError] = useState(null);

  // Handle navigation to login if user is not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading({ products: true, orders: true, inventory: true });
      setError(null);
      try {
        const token = localStorage.getItem('token');
        if (!token || !user) {
          navigate('/login');
          return;
        }

        const headers = { Authorization: `Bearer ${token}` };

        const [productsRes, ordersRes, inventoryRes] = await Promise.all([
          axios.get('http://localhost:3000/api/seller/products', { headers }),
          axios.get('http://localhost:3000/api/seller/orders', { headers }),
          axios.get('http://localhost:3000/api/seller/inventory', { headers }),
        ]);

        const productsData = productsRes.data || [];
        const ordersData = ordersRes.data || [];
        const inventoryData = inventoryRes.data || [];

        setProducts(productsData);
        setOrders(ordersData);
        setInventory(inventoryData);

        setStats({
          totalProducts: productsData.length,
          totalOrders: ordersData.length,
          pendingOrders: ordersData.filter((order) => order.status === 'pending').length,
          lowStockItems: inventoryData.filter((item) => item.quantity < 10).length,
        });
      } catch (error) {
        console.error('Error fetching seller data:', error);
        setError('Failed to load data. Please try again.');
        if (error.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading({ products: false, orders: false, inventory: false });
      }
    };

    if (user) {
      fetchData();
    }
  }, [navigate, user]);

  // Debounced order status update
  const handleUpdateOrderStatus = useCallback(
    debounce(async (orderId, newStatus) => {
      try {
        const token = localStorage.getItem('token');
        await axios.put(
          `http://localhost:3000/api/seller/orders/${orderId}/status`,
          { status: newStatus },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setOrders((prev) =>
          prev.map((order) => (order._id === orderId ? { ...order, status: newStatus } : order))
        );
        toast.success('Order status updated!');
      } catch (error) {
        console.error('Error updating order status:', error);
        toast.error('Failed to update order status.');
      }
    }, 300),
    []
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Memoized stats cards
  const statCards = useMemo(
    () => [
      {
        title: 'Total Products',
        value: stats.totalProducts,
        icon: <Package className="h-6 w-6 text-blue-600" />,
        color: 'border-blue-500',
      },
      {
        title: 'Total Orders',
        value: stats.totalOrders,
        icon: <ShoppingCart className="h-6 w-6 text-green-600" />,
        color: 'border-green-500',
      },
      {
        title: 'Pending Orders',
        value: stats.pendingOrders,
        icon: <AlertCircle className="h-6 w-6 text-yellow-600" />,
        color: 'border-yellow-500',
      },
      {
        title: 'Low Stock Items',
        value: stats.lowStockItems,
        icon: <BarChart2 className="h-6 w-6 text-red-600" />,
        color: 'border-red-500',
      },
    ],
    [stats]
  );

  // Prevent rendering if user is not authenticated
  if (!user) {
    return null; // or a loading spinner if desired
  }

  if (error) {
    return (
      <div className="p-4 text-red-600">
        {error}
        <button
          onClick={() => {
            setError(null);
            if (user) {
              fetchData();
            }
          }}
          className="ml-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-100">
        <ToastContainer />
        {/* <NavBar /> */}
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-blue-800">Seller Dashboard</h1>
            <button
              onClick={logout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              aria-label="Logout"
            >
              Logout
            </button>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Welcome, {user.username || 'Seller'} (Seller)</h2>
            <p className="text-gray-600 mb-6">Manage product listings, orders, and inventory here.</p>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {statCards.map((card) => (
                <StatCard
                  key={card.title}
                  title={card.title}
                  value={card.value}
                  icon={card.icon}
                  color={card.color}
                />
              ))}
            </div>

            {/* Navigation Tabs */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="flex -mb-px" role="tablist">
                {['products', 'orders', 'inventory'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 text-center border-b-2 font-medium text-sm ${
                      activeTab === tab
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                    role="tab"
                    aria-selected={activeTab === tab}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)} Management
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            {activeTab === 'products' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">Your Products</h3>
                  <Link
                    to="/seller/add-product"
                    className="inline-flex items-center bg-blue-600 px-4 py-2 rounded-md text-white hover:bg-blue-700 transition duration-300"
                    aria-label="Add new product"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Add Product
                  </Link>
                </div>
                {loading.products ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
                  </div>
                ) : products.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No products listed yet. Add your first product!</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Product
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Price
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Stock
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Category
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {products.map((product) => (
                          <tr key={product._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="h-10 w-10 bg-gray-200 rounded-md flex items-center justify-center">
                                  {product.imageUrl ? (
                                    <img
                                      src={product.imageUrl}
                                      alt={product.name}
                                      className="h-10 w-10 rounded-md object-cover"
                                    />
                                  ) : (
                                    <Package className="h-6 w-6 text-gray-400" />
                                  )}
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                  <div className="text-sm text-gray-500">ID: {product._id}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">${product.price.toFixed(2)}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  product.stock > 10 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {product.stock}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {product.category}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end space-x-3">
                                <button
                                  onClick={() => navigate(`/seller/edit-product/${product._id}`)}
                                  className="text-blue-600 hover:text-blue-900"
                                  aria-label={`Edit product ${product.name}`}
                                >
                                  <Edit className="h-5 w-5" />
                                </button>
                                <button
                                  onClick={async () => {
                                    if (window.confirm('Are you sure you want to remove this product?')) {
                                      try {
                                        const token = localStorage.getItem('token');
                                        await axios.delete(`http://localhost:3000/api/seller/products/${product._id}`, {
                                          headers: { Authorization: `Bearer ${token}` },
                                        });
                                        setProducts(products.filter((p) => p._id !== product._id));
                                        toast.success('Product removed successfully.');
                                      } catch (err) {
                                        console.error('Error deleting product', err);
                                        toast.error('Failed to delete product.');
                                      }
                                    }
                                  }}
                                  className="text-red-600 hover:text-red-900"
                                  aria-label={`Delete product ${product.name}`}
                                >
                                  <Trash2 className="h-5 w-5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'orders' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">Order Management</h3>
                  <select
                    className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    defaultValue="all"
                    onChange={(e) => {
                      // Add filtering logic here
                    }}
                    aria-label="Filter orders"
                  >
                    <option value="all">All Orders</option>
                    <option value="new">New Orders</option>
                    <option value="pending">Pending Orders</option>
                    <option value="completed">Completed Orders</option>
                  </select>
                </div>
                {loading.orders ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No orders yet.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Order ID
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Customer
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Total
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {orders.map((order) => (
                          <tr key={order._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">#{order._id}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{order.customer?.name || 'Customer'}</div>
                              <div className="text-sm text-gray-500">{order.customer?.email || 'N/A'}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">{formatDate(order.createdAt)}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                                  order.status
                                )}`}
                              >
                                {order.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              ${order.total?.toFixed(2) || '0.00'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end space-x-3">
                                <button
                                  onClick={() => navigate(`/seller/order/${order._id}`)}
                                  className="text-blue-600 hover:text-blue-900"
                                  aria-label={`View order ${order._id}`}
                                >
                                  <Eye className="h-5 w-5" />
                                </button>
                                <select
                                  value={order.status}
                                  onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                                  className="border rounded text-sm px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  aria-label={`Update status for order ${order._id}`}
                                >
                                  <option value="pending">Pending</option>
                                  <option value="processing">Processing</option>
                                  <option value="shipped">Shipped</option>
                                  <option value="delivered">Delivered</option>
                                  <option value="cancelled">Cancelled</option>
                                </select>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'inventory' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">Real-time Inventory Levels</h3>
                  <Link
                    to="/seller/inventory"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
                    aria-label="Update stock levels"
                  >
                    Update Stock Levels
                  </Link>
                </div>
                {loading.inventory ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
                  </div>
                ) : inventory.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No inventory data available.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Product
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            SKU
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Available Quantity
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Last Updated
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {inventory.map((item) => (
                          <tr key={item._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="h-10 w-10 bg-gray-200 rounded-md flex items-center justify-center">
                                  {item.imageUrl ? (
                                    <img
                                      src={item.imageUrl}
                                      alt={item.name}
                                      className="h-10 w-10 rounded-md object-cover"
                                    />
                                  ) : (
                                    <Package className="h-6 w-6 text-gray-400" />
                                  )}
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{item.sku}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{item.quantity}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  item.quantity > 20
                                    ? 'bg-green-100 text-green-800'
                                    : item.quantity > 10
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {item.quantity > 20
                                  ? 'In Stock'
                                  : item.quantity > 10
                                  ? 'Low Stock'
                                  : item.quantity > 0
                                  ? 'Critical Stock'
                                  : 'Out of Stock'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(item.updatedAt)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default SellerDashboard;