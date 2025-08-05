import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import AccountStatistics from '../components/AccountStatistics';
import { Shield } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  
  // Redirect non-admin users
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (!user.isAdmin) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex justify-center items-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-md w-full text-center">
          <Shield size={48} className="mx-auto text-red-500 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            You need administrator privileges to view this page.
          </p>
          <a 
            href="/"
            className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Return to Home
          </a>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 sm:p-6">
      <div className="container mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6">
          <div className="flex items-center mb-6">
            <Shield size={24} className="text-blue-500 mr-3" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          </div>
          
          <div className="mb-8">
            <AccountStatistics />
          </div>
          
          {/* Add more admin sections here in the future */}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
