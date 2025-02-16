import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Bandwidth() {
  const [bandwidthData, setBandwidthData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('http://localhost:5000/api/bandwidth');
        setBandwidthData(response.data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        setError('Error fetching bandwidth data');
        console.error('Error fetching bandwidth data:', err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
  }, []);

  const downloadCSV = () => {
    const csv = Papa.unparse(bandwidthData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'bandwidth_data.csv');
  };

  const filteredData = bandwidthData.filter(data =>
    data.timestamp.toLowerCase().includes(searchQuery.toLowerCase()) ||
    data.bytes_sent.toString().includes(searchQuery) ||
    data.bytes_recv.toString().includes(searchQuery)
  );

  const currentPageData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (direction) => {
    if (direction === 'next' && currentPage * itemsPerPage < filteredData.length) {
      setCurrentPage(currentPage + 1);
    } else if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const chartData = {
    labels: bandwidthData.map(item => item.timestamp),
    datasets: [
      {
        label: 'Bytes Sent',
        data: bandwidthData.map(item => item.bytes_sent),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      },
      {
        label: 'Bytes Received',
        data: bandwidthData.map(item => item.bytes_recv),
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-800 flex">
      <Sidebar />
      <div className="flex-1 p-8">
        <h1 className="text-4xl font-semibold text-white mb-8">Bandwidth Analysis</h1>

        <div className="mb-6 flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search..."
            className="px-4 py-2 border rounded-lg w-1/3 text-gray-900"
            style={{ backgroundColor: '#f7fafc' }} // Lighter background for input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            onClick={downloadCSV}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-200 ease-in-out"
          >
            Download CSV
          </button>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-10">
            <div className="loader border-t-4 border-blue-600 w-12 h-12 border-solid rounded-full animate-spin"></div>
          </div>
        )}

        {error && (
          <div className="text-red-500 text-center mb-4">
            <p>{error}</p>
          </div>
        )}

        <div className="bg-white shadow-lg rounded-lg p-6 overflow-x-auto mb-8">
          <Bar data={chartData} options={{ responsive: true, plugins: { legend: { position: 'top' }, title: { display: true, text: 'Bandwidth Overview' } } }} />
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6 overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead className="bg-blue-50">
              <tr>
                <th className="p-4 text-left text-gray-700 font-semibold">Timestamp</th>
                <th className="p-4 text-left text-gray-700 font-semibold">Bytes Sent</th>
                <th className="p-4 text-left text-gray-700 font-semibold">Bytes Received</th>
              </tr>
            </thead>
            <tbody>
              {currentPageData.length > 0 ? (
                currentPageData.map((data, index) => (
                  <tr key={index} className="hover:bg-blue-100 transition-colors duration-150">
                    <td className="p-4 text-gray-700">{data.timestamp}</td>
                    <td className="p-4 text-gray-700">{data.bytes_sent}</td>
                    <td className="p-4 text-gray-700">{data.bytes_recv}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="p-4 text-center text-gray-500">
                    No results found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="flex justify-between mt-4">
            <button
              onClick={() => handlePageChange('prev')}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange('next')}
              disabled={currentPage * itemsPerPage >= filteredData.length}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Bandwidth;
