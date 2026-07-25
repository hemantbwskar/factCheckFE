import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignIn.css';
import { User } from '../../interfaces/interfaces';

interface SignInProps {
  onLoginSuccess?: (user: User) => void;
}

const API_URL = process.env.REACT_APP_API_SIGNIN_URL || 'https://factcheckjsbe.onrender.com/api/signin';

const SignIn: React.FC<SignInProps> = ({ onLoginSuccess }) => {
  const [username, serUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiResponseDetails, setApiResponseDetails] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setApiResponseDetails(null);

    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Call the API with suffix /api/signin
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const contentType = response.headers.get('content-type');
      let data: any = {};

      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const rawText = await response.text();
        data = { rawText };
      }

      // 2. Verify API Response
      console.log('API /api/signin status:', response.status, 'Response data:', data);

      if (response.ok && data.success !== false) {
        // Successful response verification
        const user = {
          username: data.user?.username || username,
          name: data.user?.username || 'User',
          token: data.token || data.accessToken,
        };

        if (rememberMe) {
          localStorage.setItem('factcheck_user', JSON.stringify(user));
        } else {
          sessionStorage.setItem('factcheck_user', JSON.stringify(user));
        }

        if (onLoginSuccess) {
          onLoginSuccess(user);
        }

        // Navigate to home after successful authentication
        navigate('/');
      } else {
        // Response verification failed (e.g. status != 2xx or success === false)
        const failureReason =
          data.message ||
          data.error ||
          (response.status === 404
            ? `Server endpoint ${API_URL} returned status 404 (Not Found).`
            : `Authentication failed with status code ${response.status}.`);

        setError(failureReason);
        if (data.rawText) {
          setApiResponseDetails(`API Output: ${data.rawText.slice(0, 150)}`);
        }
      }
    } catch (err: any) {
      console.error('Error connecting to /api/signin:', err);
      setError(`Network Error: ${err.message || 'Could not reach signin endpoint.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Top Node Icon matching timeline node style */}
        <div className="auth-icon-node">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        </div>

        {/* Card Header */}
        <div className="auth-header">
          <span className="auth-badge">Authentication</span>
          <h2 className="auth-title">Welcome Back</h2>
          <p className="auth-subtitle">Sign in to manage your project roadmap</p>
        </div>

        {/* Form Body */}
        <form className="auth-form" onSubmit={handleSubmit}>
          {error && (
            <div className="auth-error" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <span>{error}</span>
              </div>
              {apiResponseDetails && (
                <div style={{ fontSize: '0.75rem', marginTop: '0.25rem', opacity: 0.85 }}>
                  {apiResponseDetails}
                </div>
              )}
            </div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="text">
              Username
            </label>
            <div className="input-wrapper">
              <span className="input-icon">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </span>
              <input
                id="username"
                type="text"
                className="auth-input"
                placeholder="Username"
                value={username}
                onChange={(e) => serUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <div className="input-wrapper">
              <span className="input-icon">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </span>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="auth-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="icon-btn edit-btn"
                style={{ position: 'absolute', right: '8px', width: '28px', height: '28px' }}
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="auth-options">
            <label className="remember-me">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember me
            </label>
            <a href="#forgot" onClick={(e) => e.preventDefault()} className="forgot-password">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="auth-submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span>Connecting to API...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
