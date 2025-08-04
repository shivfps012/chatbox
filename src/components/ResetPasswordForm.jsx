import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Lock, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.jsx';

const ResetPasswordForm = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [token, setToken] = useState('');
  const { resetPassword } = useAuth();

  useEffect(() => {
    // Get token from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const resetToken = urlParams.get('token');
    
    console.log('🔍 Debug: Current URL:', window.location.href);
    console.log('🔍 Debug: URL search params:', window.location.search);
    console.log('🔍 Debug: Reset token from URL:', resetToken);
    console.log('🔍 Debug: Token length:', resetToken ? resetToken.length : 0);
    console.log('🔍 Debug: Token type:', typeof resetToken);
    
    if (resetToken && resetToken.length > 0) {
      setToken(resetToken);
      console.log('✅ Token set successfully');
      console.log('✅ Token value:', resetToken);
    } else {
      setMessage('Invalid or missing reset token. Please use the link from your email.');
      console.log('❌ No valid token found in URL');
      
      // Show helpful message with instructions
      console.log('💡 To fix this:');
      console.log('1. Use one of these test links:');
      console.log('   http://localhost:5173/reset-password?token=757919598ead0b9d7786c90b2aa0407b532d81054833f92196dea59aadf00fe3');
      console.log('   http://localhost:5173/reset-password?token=3fdc60c97e08302fa4d94d2b2cfbed3df757a3fff38dffb73f5e576ccb0fe983');
      console.log('2. Copy and paste the link in your browser');
      console.log('3. The URL should have ?token= followed by 64 characters');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('🔍 Debug: Form submitted');
    console.log('🔍 Debug: Token state:', token);
    console.log('🔍 Debug: Token length:', token ? token.length : 0);
    
    if (!password || !confirmPassword) {
      setMessage('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setMessage('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    if (!token) {
      setMessage('Invalid reset token');
      console.log('❌ No token available for reset');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      console.log('🔍 Debug: Calling resetPassword with token:', token.substring(0, 20) + '...');
      const result = await resetPassword(token, password);
      console.log('🔍 Debug: Reset result:', result);
      setMessage(result.message);
      setIsSuccess(result.success);
      
      if (result.success) {
        // Redirect to main app after successful reset
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      }
    } catch (error) {
      console.error('🔍 Debug: Reset password error:', error);
      setMessage('An error occurred. Please try again.');
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center">
          <div className="mx-auto h-16 w-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Password Reset Successful
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Your password has been successfully reset. You are now logged in.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Redirecting to the app...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center">
            <Lock className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Set new password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Enter your new password below
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="password" className="sr-only">
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none relative block w-full px-3 py-3 pl-10 pr-10 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 sm:text-sm"
                  placeholder="New password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="sr-only">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="appearance-none relative block w-full px-3 py-3 pl-10 pr-10 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 sm:text-sm"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {message && (
            <div className={`text-sm text-center p-3 rounded-lg flex items-center justify-center space-x-2 ${
              isSuccess 
                ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20'
                : 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20'
            }`}>
              {isSuccess ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <span>{message}</span>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading || !token}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                'Reset password'
              )}
            </button>
          </div>

          <div className="text-center">
            <a
              href="/"
              className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
            >
              Back to sign in
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordForm;