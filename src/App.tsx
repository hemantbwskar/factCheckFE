import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Timeline from './components/timeline/Timeline';
import SignIn from './components/signin/SignIn';
import Navbar from './components/nav/Navbar';
import { User } from './interfaces/interfaces';
import { APP_ROUTES } from './config/api';

function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user info is stored in localStorage or sessionStorage
    const savedUser =
      localStorage.getItem('factcheck_user') ||
      sessionStorage.getItem('factcheck_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Failed to parse saved user credentials', e);
      }
    }
  }, []);

  const handleLoginSuccess = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('factcheck_user');
    sessionStorage.removeItem('factcheck_user');
    setUser(null);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar user={user} onLogout={handleLogout} />
        <main className="flex-1 py-8">
          <Routes>
            <Route
              path={APP_ROUTES.HOME}
              element={<Timeline isAuthenticated={!!user} />}
            />
            <Route
              path={APP_ROUTES.SIGNIN}
              element={<SignIn onLoginSuccess={handleLoginSuccess} />}
            />
            <Route path="*" element={<Navigate to={APP_ROUTES.HOME} replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
