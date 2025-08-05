import React from 'react';
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ChatInterface from './components/ChatInterface.jsx';
import AuthForm from './components/AuthForm.jsx';
import ResetPasswordForm from './components/ResetPasswordForm.jsx';
import ProfileSection from './components/ProfileSection.jsx';
import GoogleAuthSuccess from './components/GoogleAuthSuccess.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';
import HealthCheck from './components/HealthCheck.jsx';
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
import { ThemeProvider } from './contexts/ThemeContext.jsx';

const AppContent = () => {
  const { user } = useAuth();
  const [authMode, setAuthMode] = useState('login');
  const [showProfile, setShowProfile] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false);

  useEffect(() => {
    // Check if this is a password reset page
    const urlParams = new URLSearchParams(window.location.search);
    const resetToken = urlParams.get('token');
    
    if (resetToken) {
      setIsResetPassword(true);
    }
  }, []);

  // Show reset password form if token is present
  if (isResetPassword) {
    return <ResetPasswordForm />;
  }

  if (!user) {
    return (
      <AuthForm 
        mode={authMode} 
        onToggleMode={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')} 
      />
    );
  }

  if (showProfile) {
    return <ProfileSection onBack={() => setShowProfile(false)} />;
  }

  return <ChatInterface onShowProfile={() => setShowProfile(true)} />;
};

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <div className="h-screen">
            <Routes>
              <Route path="/auth/success" element={<GoogleAuthSuccess />} />
              <Route path="*" element={
                <>
                  <AppContent />
                  <HealthCheck />
                </>
              } />
            </Routes>
          </div>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;