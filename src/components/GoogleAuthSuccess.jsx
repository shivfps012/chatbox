import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const GoogleAuthSuccess = () => {
  const navigate = useNavigate();
  const { handleGoogleAuthSuccess, isLoading } = useAuth();
  const [status, setStatus] = useState('Processing authentication...');

  useEffect(() => {
    const processAuth = async () => {
      try {
        // Get the token from URL
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        
        if (!token) {
          setStatus('Authentication failed: No token found');
          return;
        }
        
        // Handle the token
        const result = await handleGoogleAuthSuccess(token);
        
        if (result && result.success) {
          setStatus('Authentication successful! Redirecting...');
          // Clean up URL
          window.history.replaceState({}, document.title, '/auth/success');
          // Navigate to home after a brief delay
          setTimeout(() => navigate('/'), 1500);
        } else {
          setStatus('Authentication failed: ' + (result?.message || 'Unknown error'));
        }
      } catch (error) {
        console.error('Error processing authentication:', error);
        setStatus('Authentication failed: ' + error.message);
      }
    };

    processAuth();
  }, [navigate, handleGoogleAuthSuccess]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
          {status.includes('successful') ? 'Sign in successful!' : 'Processing sign in...'}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {status}
        </p>
        {status.includes('failed') && (
          <button 
            onClick={() => navigate('/')} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Return to Login
          </button>
        )}
      </div>
    </div>
  );
};

export default GoogleAuthSuccess;
