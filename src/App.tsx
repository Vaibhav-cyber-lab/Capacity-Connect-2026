import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LandingPage } from './components/layout/LandingPage';
import { AuthScreen } from './components/auth/AuthScreen';
import { HomeDashboard } from './components/dashboards/HomeDashboard';

function AppRouter() {
  const { user } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  if (!user) {
    if (showAuth) {
      return <AuthScreen onBack={() => setShowAuth(false)} />;
    }
    return <LandingPage onGetStarted={() => setShowAuth(true)} />;
  }

  return <HomeDashboard />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}
