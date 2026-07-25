import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';
import { NavbarProps } from '../interfaces';

const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  const location = useLocation();

  return (
    <header className="navbar-container">
      <div className="navbar-content">
        <Link to="/" className="navbar-brand">
          <div className="navbar-logo-badge">✓</div>
          <span>FactCheck</span>
        </Link>

        <nav className="navbar-links">
          <Link
            to="/"
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Roadmap
          </Link>

          {user ? (
            <div className="user-profile">
              <div className="user-badge">
                <span className="user-avatar">{user.name.charAt(0).toUpperCase()}</span>
                <span>{user.name}</span>
              </div>
              <button onClick={onLogout} className="signout-btn">
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              to="/signin"
              className={`nav-btn-signin ${location.pathname === '/signin' ? 'active' : ''}`}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                <polyline points="10 17 15 12 10 7"></polyline>
                <line x1="15" y1="12" x2="3" y2="12"></line>
              </svg>
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
