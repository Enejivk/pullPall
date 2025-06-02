import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { NavBar } from './components/layout/NavBar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { ReviewPage } from './pages/ReviewPage';
import { useAppStore } from './lib/store';

// Mock user for demo purposes
const DEMO_USER = {
  id: '1',
  name: 'Demo User',
  username: 'demouser',
  avatar: 'https://github.com/github.png',
};

function App() {
  // For demo: Auto-login with mock user
  const { user, setUser } = useAppStore();

  React.useEffect(() => {
    // Auto-set demo user for showcase purposes
    if (!user) {
      setUser(DEMO_USER);
    }
  }, [user, setUser]);

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-grow pt-16">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/review/:id" element={<ReviewPage />} />
          <Route path="*" element={<Navigate to="/\" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;