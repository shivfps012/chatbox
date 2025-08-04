import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Loader } from 'lucide-react';
import config from '../config/env.js';

const HealthCheck = () => {
  const [status, setStatus] = useState('checking');
  const [error, setError] = useState(null);

  useEffect(() => {
    checkBackendHealth();
  }, []);

  const checkBackendHealth = async () => {
    try {
      const response = await fetch(`${config.SERVER_URL}/api/health`);
      
      if (response.ok) {
        setStatus('healthy');
      } else {
        setStatus('unhealthy');
        setError(`Backend responded with status: ${response.status}`);
      }
    } catch (err) {
      setStatus('unhealthy');
      setError('Cannot connect to backend server. Make sure the server is running on port 5000.');
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'unhealthy':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Loader className="h-5 w-5 text-blue-500 animate-spin" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'healthy':
        return 'Backend server is running';
      case 'unhealthy':
        return 'Backend server is not responding';
      default:
        return 'Checking backend connection...';
    }
  };

  if (status === 'healthy') {
    return null; // Don't show anything if backend is healthy
  }

  return (
    <div className="fixed top-4 right-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 max-w-sm z-50">
      <div className="flex items-center space-x-3">
        {getStatusIcon()}
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {getStatusText()}
          </p>
          {error && (
            <p className="text-xs text-red-600 dark:text-red-400 mt-1">
              {error}
            </p>
          )}
        </div>
      </div>
      
      {status === 'unhealthy' && (
        <div className="mt-3 text-xs text-gray-600 dark:text-gray-400">
          <p>To fix this:</p>
          <ol className="list-decimal list-inside mt-1 space-y-1">
            <li>Make sure MongoDB is running</li>
            <li>Start the backend server: <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">npm run server:dev</code></li>
            <li>Check that the server is running on port 5000</li>
          </ol>
        </div>
      )}
    </div>
  );
};

export default HealthCheck; 