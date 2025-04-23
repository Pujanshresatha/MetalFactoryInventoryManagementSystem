import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarCheck, Clock3, BarChart3 } from 'lucide-react';

const SupervisorEmployeeMonitoring = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: 'Track Attendance',
      description: 'View daily attendance records and employee check-ins.',
      icon: <CalendarCheck />,
      path: '/supervisor/attendance',
    },
    {
      title: 'Track Work Shifts',
      description: 'Monitor shift schedules and employee shift logs.',
      icon: <Clock3 />,
      path: '/supervisor/shifts',
    },
    {
      title: 'View Employee Performance',
      description: 'Analyze performance reports and productivity stats.',
      icon: <BarChart3 />,
      path: '/supervisor/performance',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-10 px-6 md:px-12">
      <h2 className="text-3xl font-bold text-blue-900 mb-8 text-center">
        Employee Monitoring
      </h2>

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {actions.map((action, idx) => (
          <MonitoringCard key={idx} {...action} onClick={() => navigate(action.path)} />
        ))}
      </div>
    </div>
  );
};

const MonitoringCard = ({ title, description, icon, onClick }) => (
  <div
    onClick={onClick}
    className="cursor-pointer bg-white/80 hover:bg-white backdrop-blur-md border border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1"
  >
    <div className="flex items-center mb-4 text-blue-600">
      {React.cloneElement(icon, { className: 'w-8 h-8 mr-2' })}
      <h3 className="text-xl font-semibold">{title}</h3>
    </div>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default SupervisorEmployeeMonitoring;
