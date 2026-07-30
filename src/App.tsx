import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Timeline from './components/timeline/Timeline';
import SignIn from './components/signin/SignIn';
import Navbar from './components/nav/Navbar';
import { User } from './interfaces/interfaces';
import { APP_ROUTES } from './config/api';
import { Theme, applyTheme, getInitialTheme } from './utils/themeUtils';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

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
      <div className="app-layout min-h-screen flex flex-col">
        <Navbar
          user={user}
          onLogout={handleLogout}
          theme={theme}
          onToggleTheme={handleToggleTheme}
        />
        <main className="flex-1 py-8">
          <Routes>
            <Route
              path={APP_ROUTES.HOME}
              element={<Timeline isAuthenticated={!!user} currentUser={user} />}
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
