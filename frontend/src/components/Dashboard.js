import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { motion } from 'framer-motion';
import { LogOut, RefreshCw, Search } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard({ setIsAuthenticated }) {
  const [networkData, setNetworkData] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/network');
      setNetworkData(response.data);
      updateChartData(response.data);
    } catch (err) {
      console.error('Error fetching network data:', err);
    }
  };

  const updateChartData = (data) => {
    const timestamp = new Date().toLocaleTimeString();
    setChartData((prevData) => [
      ...prevData.slice(-9), // Keep only the last 9 data points
      { timestamp, ...data },
    ]);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    navigate('/login');
  };

  const handleRefresh = () => {
    fetchData();
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredData = networkData
    ? Object.entries(networkData).filter(([key, value]) => {
        if (filter === 'all') return true;
        return key === filter;
      })
    : [];

  const searchedData = filteredData.filter(([key, value]) =>
    key.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Network Metrics Over Time',
      },
    },
  };

  const chartDataConfig = {
    labels: chartData.map((data) => data.timestamp),
    datasets: [
      {
        label: 'Packets Sent',
        data: chartData.map((data) => data.packets_sent),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      },
      {
        label: 'Packets Received',
        data: chartData.map((data) => data.packets_received),
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 border-b pb-4 border-gray-700">
          <h1 className="text-3xl font-extrabold">Network Monitoring</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-all"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search metrics..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>
          <select
            value={filter}
            onChange={handleFilterChange}
            className="bg-gray-800 border border-gray-700 rounded-lg text-white px-4 py-2 focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Metrics</option>
            <option value="packets_sent">Packets Sent</option>
            <option value="packets_received">Packets Received</option>
            <option value="latency">Latency</option>
          </select>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all"
          >
            <RefreshCw size={20} /> Refresh
          </button>
        </div>

        {/* Chart */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 mb-8">
          <Line data={chartDataConfig} options={chartOptions} />
        </div>

        {/* Network Metrics */}
        {networkData ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchedData.map(([key, value]) => (
              <motion.div
                key={key}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 text-center"
              >
                <h2 className="text-lg font-semibold text-gray-400 capitalize">{key.replace('_', ' ')}</h2>
                <p className="text-3xl font-bold text-white">{value}</p>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400">Loading network data...</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;