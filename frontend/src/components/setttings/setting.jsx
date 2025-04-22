// import React, { useState, useContext } from 'react';
// import { Eye, EyeOff } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { AuthContext } from '../customer/auth/AuthContext';

// const API = import.meta.env.VITE_API_BASE_URL;

// function ChangePasswordForm() {
//   const navigate = useNavigate();
//   const { logout } = useContext(AuthContext); // Use logout from AuthContext

//   const [formData, setFormData] = useState({
//     currentPassword: '',
//     newPassword: '',
//     confirmPassword: '',
//   });

//   const [errors, setErrors] = useState({});
//   const [message, setMessage] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState({
//     current: false,
//     new: false,
//     confirm: false,
//   });

//   const validateForm = () => {
//     const newErrors = {};

//     if (!formData.currentPassword) {
//       newErrors.currentPassword = 'Current password is required';
//     }

//     if (!formData.newPassword) {
//       newErrors.newPassword = 'New password is required';
//     } else if (formData.newPassword.length < 8) {
//       newErrors.newPassword = 'Password must be at least 8 characters';
//     }

//     if (formData.newPassword !== formData.confirmPassword) {
//       newErrors.confirmPassword = 'Passwords do not match';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     setErrors((prev) => ({ ...prev, [name]: '' }));
//     setMessage('');
//   };

//   const toggleVisibility = (field) => {
//     setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) {
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const response = await axios.post(
//         `${API}/auth/change-password`,
//         {
//           currentPassword: formData.currentPassword,
//           newPassword: formData.newPassword,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`,
//           },
//         }
//       );

//       console.log('API Response:', response.data);
//       setMessage(response.data.message);
//       setFormData({
//         currentPassword: '',
//         newPassword: '',
//         confirmPassword: '',
//       });

//       // Force logout after showing success message
//       setTimeout(() => {
//         logout(); // Use AuthContext logout
//       }, 2000);
//     } catch (error) {
//       console.error('API Error:', error.response?.data || error.message);
//       setErrors({
//         api: error.response?.data?.message || 'Failed to change password',
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleLogout = () => {
//     logout(); // Use AuthContext logout
//   };

//   const renderPasswordField = (label, name, value, error, show, toggle) => (
//     <div>
//       <label htmlFor={name} className="block text-sm font-medium text-gray-700">
//         {label}
//       </label>
//       <div className="relative mt-1">
//         <input
//           type={show ? 'text' : 'password'}
//           id={name}
//           name={name}
//           value={value}
//           onChange={handleChange}
//           className="block w-full rounded-lg border border-gray-300 py-3 px-4 pr-10 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
//           placeholder={`Enter ${label.toLowerCase()}`}
//           disabled={isLoading}
//         />
//         <button
//           type="button"
//           onClick={toggle}
//           className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 focus:outline-none"
//         >
//           {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//         </button>
//       </div>
//       {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8 space-y-8 transform transition-all hover:shadow-2xl">
//         <div>
//           <h2 className="text-3xl font-extrabold text-gray-900 text-center">Account Settings</h2>
//           <p className="mt-2 text-sm text-gray-600 text-center">Update your password securely</p>
//         </div>

//         {message && (
//           <div className="p-4 bg-green-50 text-green-800 rounded-lg border border-green-200 flex items-center">
//             <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
//             </svg>
//             {message}
//           </div>
//         )}

//         {errors.api && (
//           <div className="p-4 bg-red-50 text-red-800 rounded-lg border border-red-200 flex items-center">
//             <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//             </svg>
//             {errors.api}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-6">
//           {renderPasswordField(
//             'Current Password',
//             'currentPassword',
//             formData.currentPassword,
//             errors.currentPassword,
//             showPassword.current,
//             () => toggleVisibility('current')
//           )}

//           {renderPasswordField(
//             'New Password',
//             'newPassword',
//             formData.newPassword,
//             errors.newPassword,
//             showPassword.new,
//             () => toggleVisibility('new')
//           )}

//           {renderPasswordField(
//             'Confirm New Password',
//             'confirmPassword',
//             formData.confirmPassword,
//             errors.confirmPassword,
//             showPassword.confirm,
//             () => toggleVisibility('confirm')
//           )}

//           <button
//             type="submit"
//             className={`w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-150 ease-in-out ${
//               isLoading ? 'opacity-50 cursor-not-allowed' : ''
//             }`}
//             disabled={isLoading}
//           >
//             {isLoading ? 'Changing Password...' : 'Change Password'}
//           </button>
//         </form>

//         <div className="pt-6 border-t border-gray-200">
//           <button
//             type="button"
//             onClick={handleLogout}
//             className="w-full text-red-600 hover:text-red-800 font-medium text-sm py-2"
//           >
//             Logout
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ChangePasswordForm;


import React, { useState, useContext } from 'react';
import { Eye, EyeOff, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../customer/auth/AuthContext';

const API = import.meta.env.VITE_API_BASE_URL;

function AccountSettingsForm() {
  const navigate = useNavigate();
  const { logout, setUser } = useContext(AuthContext); // Added setUser to update user data

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    newUsername: '',
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const validateForm = (type) => {
    const newErrors = {};

    if (type === 'password') {
      if (!formData.currentPassword) {
        newErrors.currentPassword = 'Current password is required';
      }
      if (!formData.newPassword) {
        newErrors.newPassword = 'New password is required';
      } else if (formData.newPassword.length < 8) {
        newErrors.newPassword = 'Password must be at least 8 characters';
      }
      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    } else if (type === 'username') {
      if (!formData.newUsername) {
        newErrors.newUsername = 'New username is required';
      } else if (formData.newUsername.length < 3) {
        newErrors.newUsername = 'Username must be at least 3 characters';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
    setMessage('');
  };

  const toggleVisibility = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm('password')) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${API}/auth/change-password`,
        {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      setMessage(response.data.message);
      setFormData((prev) => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));

      // Force logout after showing success message
      setTimeout(() => {
        logout();
      }, 2000);
    } catch (error) {
      setErrors({
        api: error.response?.data?.message || 'Failed to change password',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUsernameSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm('username')) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${API}/auth/change-username`,
        {
          newUsername: formData.newUsername,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      // Update user data in localStorage and AuthContext
      const updatedUser = { ...JSON.parse(localStorage.getItem('user')), username: formData.newUsername };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);

      setMessage(response.data.message || 'Username updated successfully');
      setFormData((prev) => ({ ...prev, newUsername: '' }));
    } catch (error) {
      setErrors({
        api: error.response?.data?.message || 'Failed to change username',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const renderPasswordField = (label, name, value, error, show, toggle) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative mt-1">
        <input
          type={show ? 'text' : 'password'}
          id={name}
          name={name}
          value={value}
          onChange={handleChange}
          className="block w-full rounded-lg border border-gray-300 py-3 px-4 pr-10 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
          placeholder={`Enter ${label.toLowerCase()}`}
          disabled={isLoading}
        />
        <button
          type="button"
          onClick={toggle}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 focus:outline-none"
        >
          {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );

  const renderUsernameField = () => (
    <div>
      <label htmlFor="newUsername" className="block text-sm font-medium text-gray-700">
        New Username
      </label>
      <div className="relative mt-1">
        <input
          type="text"
          id="newUsername"
          name="newUsername"
          value={formData.newUsername}
          onChange={handleChange}
          className="block w-full rounded-lg border border-gray-300 py-3 px-4 pl-10 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
          placeholder="Enter new username"
          disabled={isLoading}
        />
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
          <User className="w-5 h-5" />
        </span>
      </div>
      {errors.newUsername && <p className="mt-2 text-sm text-red-600">{errors.newUsername}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8 space-y-8 transform transition-all hover:shadow-2xl">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 text-center">Account Settings</h2>
          <p className="mt-2 text-sm text-gray-600 text-center">Update your username or password securely</p>
        </div>

        {message && (
          <div className="p-4 bg-green-50 text-green-800 rounded-lg border border-green-200 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            {message}
          </div>
        )}

        {errors.api && (
          <div className="p-4 bg-red-50 text-red-800 rounded-lg border border-red-200 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            {errors.api}
          </div>
        )}

        {/* Username Change Form */}
        <form onSubmit={handleUsernameSubmit} className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-800">Change Username</h3>
          {renderUsernameField()}
          <button
            type="submit"
            className={`w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-150 ease-in-out ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={isLoading}
          >
            {isLoading ? 'Changing Username...' : 'Change Username'}
          </button>
        </form>

        {/* Password Change Form */}
        <form onSubmit={handlePasswordSubmit} className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-800">Change Password</h3>
          {renderPasswordField(
            'Current Password',
            'currentPassword',
            formData.currentPassword,
            errors.currentPassword,
            showPassword.current,
            () => toggleVisibility('current')
          )}
          {renderPasswordField(
            'New Password',
            'newPassword',
            formData.newPassword,
            errors.newPassword,
            showPassword.new,
            () => toggleVisibility('new')
          )}
          {renderPasswordField(
            'Confirm New Password',
            'confirmPassword',
            formData.confirmPassword,
            errors.confirmPassword,
            showPassword.confirm,
            () => toggleVisibility('confirm')
          )}
          <button
            type="submit"
            className={`w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-150 ease-in-out ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={isLoading}
          >
            {isLoading ? 'Changing Password...' : 'Change Password'}
          </button>
        </form>

        <div className="pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full text-red-600 hover:text-red-800 font-medium text-sm py-2"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default AccountSettingsForm;