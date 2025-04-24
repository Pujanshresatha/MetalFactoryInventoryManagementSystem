import React, { useState, useEffect } from 'react';
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

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editUserId, setEditUserId] = useState(null);
  const [formData, setFormData] = useState({ role: '', newPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const usersPerPage = 6;

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    // Filter users based on search term and role
    let filtered = users;
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (roleFilter) {
      filtered = filtered.filter(user => user.role === roleFilter);
    }
    setFilteredUsers(filtered);
    setCurrentPage(0); // Reset to first page on filter change
  }, [searchTerm, roleFilter, users]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/admin/users');
      setUsers(res.data);
      setFilteredUsers(res.data);
      setError('');
    } catch (err) {
      setError('Error fetching users: ' + (err.response?.data?.error || err.message));
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.put(`/api/admin/users/${editUserId}/role`, { role: formData.role });
      toast.success('User role updated successfully');
      setIsEditModalOpen(false);
      fetchUsers();
      resetForm();
    } catch (err) {
      setError('Error updating user role: ' + (err.response?.data?.error || err.message));
      toast.error('Failed to update user role');
    } finally {
      setLoading(false);
    }
  };

  const resetUserPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`/api/admin/users/${editUserId}/reset-password`, { newPassword: formData.newPassword });
      toast.success('Password reset successfully');
      setIsResetPasswordModalOpen(false);
      fetchUsers();
      resetForm();
    } catch (err) {
      setError('Error resetting password: ' + (err.response?.data?.error || err.message));
      toast.error('Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setLoading(true);
      try {
        await axios.delete(`/api/admin/users/${id}`);
        fetchUsers();
        toast.success('User deleted successfully');
        if (selectedUser && selectedUser._id === id) {
          setSelectedUser(null);
        }
      } catch (err) {
        setError('Error deleting user: ' + (err.response?.data?.error || err.message));
        toast.error('Failed to delete user');
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setFormData({ role: '', newPassword: '' });
    setEditUserId(null);
  };

  // Pagination logic
  const pageCount = Math.ceil(filteredUsers.length / usersPerPage);
  const offset = currentPage * usersPerPage;
  const currentUsers = filteredUsers.slice(offset, offset + usersPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'Admin':
        return 'bg-blue-500 text-white';
      case 'Customer':
        return 'bg-green-500 text-white';
      case 'Supervisor':
        return 'bg-yellow-500 text-white';
      case 'Seller':
        return 'bg-purple-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <Toaster position="top-right" reverseOrder={false} />
        {error && <p className="text-red-500 mb-4 bg-red-50 p-3 rounded-lg">{error}</p>}

        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Manage Users
            </h1>
            <p className="text-lg text-gray-600 mt-2">View and manage all users in your system.</p>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by username or email..."
              className="w-full p-4 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div className="relative w-full sm:w-48">
            <select
              className="w-full p-4 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white shadow-sm appearance-none"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="">All Roles</option>
              <option value="Admin">Admin</option>
              <option value="Customer">Customer</option>
              <option value="Supervisor">Supervisor</option>
              <option value="Seller">Seller</option>
            </select>
            <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          </div>
        </div>

        {/* Edit Role Modal */}
        <Modal
          isOpen={isEditModalOpen}
          onRequestClose={() => {
            setIsEditModalOpen(false);
            resetForm();
          }}
          className="bg-gradient-to-br from-white to-blue-50 p-8 rounded-2xl shadow-2xl max-w-md mx-auto mt-16 transform transition-all duration-500"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Update User Role
          </h2>
          <form onSubmit={updateUserRole}>
            <div className="mb-5">
              <label className="flex items-center gap-2 text-lg font-semibold text-gray-700 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Role
              </label>
              <select
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                required
              >
                <option value="">Select Role</option>
                <option value="Customer">Customer</option>
                <option value="Admin">Admin</option>
                <option value="Supervisor">Supervisor</option>
                <option value="Seller">Seller</option>
              </select>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-blue-600 text-white p-4 rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300 disabled:bg-blue-400 flex items-center gap-2 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              >
                {loading && (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"></path>
                  </svg>
                )}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Update Role
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditModalOpen(false);
                  resetForm();
                }}
                className="bg-gray-500 text-white p-4 rounded-lg shadow-lg hover:bg-gray-600 transition-all duration-300 flex items-center gap-2 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancel
              </button>
            </div>
          </form>
        </Modal>

        {/* Reset Password Modal */}
        <Modal
          isOpen={isResetPasswordModalOpen}
          onRequestClose={() => {
            setIsResetPasswordModalOpen(false);
            resetForm();
          }}
          className="bg-gradient-to-br from-white to-blue-50 p-8 rounded-2xl shadow-2xl max-w-md mx-auto mt-16 transform transition-all duration-500"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0-1.104-.896-2-2-2s-2 .896-2 2c0 .738.406 1.376 1 1.723V15a1 1 0 001 1h2a1 1 0 001-1v-2.277c.594-.347 1-.985 1-1.723zm-2-5a5 5 0 00-5 5c0 1.518.698 2.878 1.793 3.764A5 5 0 005 18v1h10v-1a5 5 0 00-1.793-3.236A5 5 0 0015 11a5 5 0 00-5-5z" />
            </svg>
            Reset Password
          </h2>
          <form onSubmit={resetUserPassword}>
            <div className="mb-5">
              <label className="flex items-center gap-2 text-lg font-semibold text-gray-700 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 11-4 0 2 2 0 014 0zm-2 7c-1.104 0-2 .896-2 2v3h4v-3c0-1.104-.896-2-2-2zm-7 2c0-1.518.698-2.878 1.793-3.764A5 5 0 005 11a5 5 0 00-5 5v1h10v-1a5 5 0 00-1.793-3.236A5 5 0 006 11z" />
                </svg>
                New Password
              </label>
              <input
                type="password"
                placeholder="Enter new password"
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white"
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                required
                minLength="8"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-blue-600 text-white p-4 rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300 disabled:bg-blue-400 flex items-center gap-2 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              >
                {loading && (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"></path>
                  </svg>
                )}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Reset Password
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsResetPasswordModalOpen(false);
                  resetForm();
                }}
                className="bg-gray-500 text-white p-4 rounded-lg shadow-lg hover:bg-gray-600 transition-all duration-300 flex items-center gap-2 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancel
              </button>
            </div>
          </form>
        </Modal>

        {/* Selected User Details Modal */}
        {selectedUser && (
          <Modal
            isOpen={!!selectedUser}
            onRequestClose={() => setSelectedUser(null)}
            className="bg-gradient-to-br from-white to-blue-50 p-8 rounded-2xl shadow-2xl max-w-md mx-auto mt-16 transform transition-all duration-500"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01m-.01 4h.01" />
              </svg>
              User Details
            </h2>
            <div className="space-y-3">
              <p className="text-gray-700"><strong className="font-semibold">Username:</strong> {selectedUser.username}</p>
              <p className="text-gray-700"><strong className="font-semibold">Email:</strong> {selectedUser.email}</p>
              <p className="text-gray-700"><strong className="font-semibold">Role:</strong> {selectedUser.role}</p>
              <p className="text-gray-700"><strong className="font-semibold">Created At:</strong> {new Date(selectedUser.createdAt).toLocaleString()}</p>
            </div>
            <button
              onClick={() => setSelectedUser(null)}
              className="bg-gray-500 text-white p-4 rounded-lg shadow-lg hover:bg-gray-600 transition-all duration-300 flex items-center gap-2 transform hover:scale-105 mt-6 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Close
            </button>
          </Modal>
        )}

        {/* User List in Card View */}
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"></path>
            </svg>
          </div>
        ) : filteredUsers.length === 0 ? (
          <p className="text-gray-600 text-center">No users found.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentUsers.map(user => (
                <div
                  key={user._id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                >
                  <div className="p-6">
                    {/* User Avatar */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-semibold text-lg">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800">{user.username}</h3>
                        <p className="text-gray-600 text-sm">{user.email}</p>
                      </div>
                    </div>
                    {/* Role Badge and Created At */}
                    <div className="flex justify-between items-center mb-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(user.role)}`}>
                        {user.role}
                      </span>
                      <p className="text-gray-600 text-sm">
                        Created: {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition-all duration-300 text-sm flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                        title="View user details"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View
                      </button>
                      <button
                        onClick={() => {
                          setEditUserId(user._id);
                          setFormData({ ...formData, role: user.role });
                          setIsEditModalOpen(true);
                        }}
                        className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 transition-all duration-300 text-sm flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        title="Edit user role"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit Role
                      </button>
                      <button
                        onClick={() => {
                          setEditUserId(user._id);
                          setIsResetPasswordModalOpen(true);
                        }}
                        className="bg-purple-500 text-white px-3 py-1 rounded-lg hover:bg-purple-600 transition-all duration-300 text-sm flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        title="Reset user password"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0-1.104-.896-2-2-2s-2 .896-2 2c0 .738.406 1.376 1 1.723V15a1 1 0 001 1h2a1 1 0 001-1v-2.277c.594-.347 1-.985 1-1.723zm-2-5a5 5 0 00-5 5c0 1.518.698 2.878 1.793 3.764A5 5 0 005 18v1h10v-1a5 5 0 00-1.793-3.236A5 5 0 0015 11a5 5 0 00-5-5z" />
                        </svg>
                        Reset Password
                      </button>
                      <button
                        onClick={() => deleteUser(user._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-all duration-300 text-sm flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                        title="Delete user"
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
              <div className="mt-8">
                <ReactPaginate
                  previousLabel={'← Previous'}
                  nextLabel={'Next →'}
                  pageCount={pageCount}
                  onPageChange={handlePageClick}
                  containerClassName={'flex justify-center gap-2 mt-4'}
                  pageClassName={'px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-200 transition-all duration-300 text-gray-700 font-medium'}
                  activeClassName={'bg-blue-600 text-white border-blue-600'}
                  previousClassName={'px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-200 transition-all duration-300 text-gray-700 font-medium'}
                  nextClassName={'px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-200 transition-all duration-300 text-gray-700 font-medium'}
                  disabledClassName={'opacity-50 cursor-not-allowed'}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ManageUsers;