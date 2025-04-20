import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { LineChart, XAxis, YAxis, Tooltip, Legend, Line } from 'recharts';
import { AuthContext } from '../customer/auth/AuthContext';

function OwnerDashboard() {
  const { logout, token } = useContext(AuthContext);
  const [analytics, setAnalytics] = useState({ sales: [], topProducts: [], stockValue: 0 });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await axios.get('/api/analytics', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnalytics(res.data);
    } catch (err) {
      console.error('Error fetching analytics:', err);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between">
        <h1 className="text-2xl">Owner Dashboard</h1>
        <button onClick={logout} className="bg-red-500 text-white p-2 rounded">Logout</button>
      </div>
      <div className="mt-4">
        <h2 className="text-xl mb-2">Sales Analytics</h2>
        <div className="border p-4 rounded">
          <LineChart width={600} height={300} data={analytics.sales} className="mx-auto">
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
          </LineChart>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div>
          <h2 className="text-xl mb-2">Top Products</h2>
          <div className="border p-4 rounded max-h-64 overflow-y-auto">
            {analytics.topProducts.length === 0 ? (
              <p>No product data available</p>
            ) : (
              <ul>
                {analytics.topProducts.map(product => (
                  <li key={product._id} className="p-2 border-b">
                    {product.name} - Sold: {product.sold}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div>
          <h2 className="text-xl mb-2">Stock Value</h2>
          <div className="border p-4 rounded">
            <p className="text-2xl font-bold">${analytics.stockValue}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OwnerDashboard;