import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';

function Security() {
  const [securityData, setSecurityData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/security');
        setSecurityData(response.data);
      } catch (err) {
        console.error('Error fetching security data:', err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000); // Fetch data every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Security & Intrusion Detection</h1>

        {/* Security Events Table */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-left">Timestamp</th>
                <th className="p-3 text-left">Event</th>
                <th className="p-3 text-left">Severity</th>
              </tr>
            </thead>
            <tbody>
              {securityData.map((data, index) => (
                <tr key={index} className="border-b">
                  <td className="p-3 text-gray-700">{data.timestamp}</td>
                  <td className="p-3 text-gray-700">{data.event}</td>
                  <td className={`p-3 ${
                    data.severity === 'High' ? 'text-red-500' :
                    data.severity === 'Medium' ? 'text-yellow-500' :
                    'text-green-500'
                  }`}>
                    {data.severity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Security;