import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import config from '../config/env.js';

// For debugging
console.log("Environment config:", config);
const API_BASE_URL = config.API_BASE_URL;
console.log("API Base URL:", API_BASE_URL);

const AccountStatistics = () => {
  const { getAuthHeaders, user } = useAuth();
  // Default values to match screenshot
  const defaultStats = {
    messagesSent: 12, 
    filesUploaded: 5,
    daysActive: 3
  };
  const [stats, setStats] = useState(defaultStats);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserStats = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/user/stats`, {
          headers: getAuthHeaders()
        });
        
        if (response.ok) {
          const data = await response.json();
          // Check if the data has a stats property, otherwise use the data directly
          const statsData = data.stats || data;
          console.log("Fetched stats:", statsData);
          
          // Validate that we have all the required properties, otherwise use defaults
          if (typeof statsData.messagesSent === 'number' && 
              typeof statsData.filesUploaded === 'number' && 
              typeof statsData.daysActive === 'number') {
            setStats(statsData);
          } else {
            console.warn("Stats data is missing required properties, using defaults");
            setStats(defaultStats);
          }
        } else {
          console.error("Failed to fetch stats:", response.status);
          // Keep default values
        }
      } catch (err) {
        console.error('Error fetching user statistics:', err);
        // Keep using default values if fetch fails
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserStats();
  }, [user, getAuthHeaders]);

  return (
    <>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Account Statistics</h2>
      
      {/* Improved responsive grid with explicit breakpoints */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg shadow-sm">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.messagesSent}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Messages Sent</div>
        </div>
        <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg shadow-sm">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.filesUploaded}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Files Uploaded</div>
        </div>
        <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg shadow-sm sm:col-span-2 md:col-span-1">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.daysActive}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Days Active</div>
        </div>
      </div>
    </>
  );
};

export default AccountStatistics;
