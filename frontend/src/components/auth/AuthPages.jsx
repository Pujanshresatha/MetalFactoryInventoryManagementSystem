import React, { useState, useContext } from 'react';
import { AuthContext } from './AuthContext';
import { Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

function InputField({ type, placeholder, value, onChange, showToggle, toggleVisibility }) {
  return (
    <div className="relative">
      <input
        type={type}
        placeholder={placeholder}
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={value}
        onChange={onChange}
        required
      />
      {showToggle && (
        <button
          type="button"
          onClick={toggleVisibility}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          {type === 'password' ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      )}
    </div>
  );
}

export function LoginPage() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('LoginPage must be used within an AuthProvider');
  }
  const { login } = context;

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'Customer',
  });
  const [error, setError] = useState('');

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login(formData.email, formData.password, formData.role);
    if (!result.success) {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md">
        <h1 className="text-4xl font-extrabold text-center mb-2 text-blue-800">Metal Factory</h1>
        <h2 className="text-lg font-medium text-center mb-6 text-gray-600">Welcome Back! Please login.</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-5">
          <InputField
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <InputField
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            showToggle
            toggleVisibility={() => setShowPassword((prev) => !prev)}
          />
          <select
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          >
            <option value="Customer">Customer</option>
            <option value="Admin">Admin</option>
            <option value="Supervisor">Supervisor</option>
            <option value="Seller">Seller</option>
          </select>
          <button
            type="submit"
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold p-3 rounded-lg transition shadow-md"
          >
            Login
          </button>
        </form>
        <p className="text-center mt-5 text-gray-600">
          <Link to="/signup" className="text-blue-600 hover:underline font-medium">
            Need an account? Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export function SignupPage() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('SignupPage must be used within an AuthProvider');
  }
  const { register } = context;

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Customer',
  });
  const [error, setError] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    const result = await register(formData.username, formData.email, formData.password, formData.role);
    if (!result.success) {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md">
        <h1 className="text-4xl font-extrabold text-center mb-2 text-blue-800">Metal Factory</h1>
        <h2 className="text-lg font-medium text-center mb-6 text-gray-600">Create your account</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-5">
          <InputField
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          />
          <InputField
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <InputField
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            showToggle
            toggleVisibility={() => setShowPassword((prev) => !prev)}
          />
          <InputField
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            showToggle
            toggleVisibility={() => setShowConfirmPassword((prev) => !prev)}
          />
          <select
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          >
            <option value="Customer">Customer</option>
            <option value="Admin">Admin</option>
            <option value="Supervisor">Supervisor</option>
            <option value="Seller">Seller</option>
          </select>
          <button
            type="submit"
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold p-3 rounded-lg transition shadow-md"
          >
            Sign Up
          </button>
        </form>
        <p className="text-center mt-5 text-gray-600">
          <Link to="/login" className="text-blue-600 hover:underline font-medium">
            Already have an account? Login
          </Link>
        </p>
      </div>
    </div>
  );
}