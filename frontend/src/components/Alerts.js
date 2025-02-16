import React from 'react';
import Sidebar from './Sidebar';

function Security() {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-gray-900">Alerts</h1>
        <p className="text-gray-700">This page will display security-related data.</p>
      </div>
    </div>
  );
}

export default Security;