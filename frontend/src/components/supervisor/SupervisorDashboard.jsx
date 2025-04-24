import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, BarChart, Package, TrendingUp } from 'lucide-react';
import { useAuth } from '../users/auth/AuthContext'; 

const SupervisorDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({ totalEmployees: 0, activeShifts: 0, dailyProduction: 0 });
  const [recentAttendance, setRecentAttendance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = 'http://localhost:4000/api'; // Replace with actual API URL

  // Redirect non-supervisors or unauthenticated users
  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (user.role?.toLowerCase() !== 'supervisor') {
      navigate('/');
    }
  }, [user, navigate]);

  // Fetch dashboard data
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      setLoading(true);
      try {
        const token = localStorage.getItem('token');

        // Stats fetch
        const statsRes = await fetch(`${API_URL}/supervisor/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (statsRes.status === 401) {
          logout();
          return;
        }

        if (!statsRes.ok) throw new Error('Failed to fetch stats');
        const statsData = await statsRes.json();
        setStats(statsData);

        // Attendance fetch
        const attendanceRes = await fetch(`${API_URL}/attendance?supervisorId=${user._id}&limit=5`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (attendanceRes.status === 401) {
          logout();
          return;
        }

        if (!attendanceRes.ok) throw new Error('Failed to fetch attendance');
        const attendanceData = await attendanceRes.json();
        setRecentAttendance(attendanceData);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Unable to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, logout]);

  const handleNavigate = (path) => navigate(path);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Supervisor Dashboard</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {loading ? (
        <p className="text-center text-gray-500">Loading dashboard...</p>
      ) : (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'Total Employees', value: stats.totalEmployees },
              { label: 'Active Shifts', value: stats.activeShifts },
              { label: 'Daily Production', value: stats.dailyProduction },
            ].map((item, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-700">{item.label}</h3>
                <p className="text-3xl font-bold text-blue-600">{item.value}</p>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-4">
            <ActionButton icon={<Calendar />} label="Track Attendance" onClick={() => handleNavigate('/supervisor/attendance')} />
            <ActionButton icon={<Clock />} label="Track Work Shifts" onClick={() => handleNavigate('/supervisor/shifts')} />
            <ActionButton icon={<BarChart />} label="View Performance" onClick={() => handleNavigate('/supervisor/performance')} />
            <ActionButton icon={<Package />} label="Daily Production" onClick={() => handleNavigate('/supervisor/production/daily')} />
            <ActionButton icon={<TrendingUp />} label="Weekly Production" onClick={() => handleNavigate('/supervisor/production/weekly')} />
          </div>

          {/* Recent Attendance Table */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Recent Attendance</h3>
            <div className="overflow-x-auto">
              {recentAttendance.length === 0 ? (
                <p className="text-center text-gray-500">No recent attendance records found</p>
              ) : (
                <table className="min-w-full border">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-2 border text-left">Employee ID</th>
                      <th className="p-2 border text-left">Name</th>
                      <th className="p-2 border text-left">Date</th>
                      <th className="p-2 border text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentAttendance.map((record) => (
                      <tr key={record._id} className="hover:bg-gray-50">
                        <td className="p-2 border">{record.employeeId}</td>
                        <td className="p-2 border">{record.employeeName}</td>
                        <td className="p-2 border">{new Date(record.date).toLocaleDateString()}</td>
                        <td className="p-2 border">{record.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ActionButton = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 flex items-center"
  >
    {React.cloneElement(icon, { className: 'w-5 h-5 mr-2' })}
    {label}
  </button>
);

export default SupervisorDashboard;
