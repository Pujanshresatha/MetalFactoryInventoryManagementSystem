import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ProductTrackingPage = () => {
  const [activeTab, setActiveTab] = useState('daily');  // State to track selected tab

  // Example data for daily and weekly stats
  const dailyData = [150, 200, 180, 170, 210, 250, 220];
  const weeklyData = [1200, 1450, 1300, 1550, 1650, 1400, 1500];
  const labels = activeTab === 'daily' ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] : ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7'];

  // Chart.js data configuration
  const chartData = {
    labels: labels,
    datasets: [{
      label: activeTab === 'daily' ? 'Daily Production' : 'Weekly Production',
      data: activeTab === 'daily' ? dailyData : weeklyData,
      borderColor: '#4CAF50',
      backgroundColor: 'rgba(76, 175, 80, 0.2)',
      borderWidth: 2,
      fill: true,
    }],
  };

  // Chart.js options configuration
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: activeTab === 'daily' ? 'Days of the Week' : 'Weeks',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Units Produced',
        },
      },
    },
  };

  // Handle tab switch
  const toggleTab = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 bg-gray-50">
      <h1 className="text-3xl font-semibold text-center text-blue-600 mb-8">Product Tracking Dashboard</h1>

      {/* Tab Navigation */}
      <div className="flex justify-center space-x-4 mb-6">
        <button
          onClick={() => toggleTab('daily')}
          className={`py-2 px-4 rounded ${activeTab === 'daily' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} hover:bg-blue-600 focus:outline-none`}
        >
          Daily Stats
        </button>
        <button
          onClick={() => toggleTab('weekly')}
          className={`py-2 px-4 rounded ${activeTab === 'weekly' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} hover:bg-blue-600 focus:outline-none`}
        >
          Weekly Stats
        </button>
      </div>

      {/* Chart Container */}
      <div className="h-80 w-full bg-white rounded-lg shadow-md p-4">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default ProductTrackingPage;
