import React from 'react';
import { useState } from 'react';
import ChatInterface from './components/ChatInterface.jsx';
import AuthForm from './components/AuthForm.jsx';
import ProfileSection from './components/ProfileSection.jsx';
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
import { ThemeProvider } from './contexts/ThemeContext.jsx';

const AppContent = () => {
  const { user } = useAuth();
  const [authMode, setAuthMode] = useState('login');
  const [showProfile, setShowProfile] = useState(false);

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
    <ThemeProvider>
      <AuthProvider>
        <div className="h-screen">
          <AppContent />
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;