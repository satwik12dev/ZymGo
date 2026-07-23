import React, { useState } from 'react';
import { Zap, User, Lock, Eye, EyeOff, Sparkles, LogIn } from 'lucide-react';
import './Login.css';

export default function Login({ onLogin }) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFillDemo = () => {
    setIdentifier('admin@zymgoo.com');
    setPassword('admin123');
    setError('');
  };

  const handleDemoDirectLogin = async () => {
    setIsLoading(true);
    setIdentifier('admin@zymgoo.com');
    setPassword('admin123');
    try {
      const res = await api.auth.login({ email: 'admin@zymgoo.com', password: 'admin123' });
      if (res.token) {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
      }
      onLogin(res.user || { username: 'Kodexive Gym Admin', role: 'Super Admin', email: 'admin@zymgoo.com' });
    } catch (err) {
      // Fallback for UI testing if DB user not pre-seeded
      onLogin({ username: 'Kodexive Gym Admin', role: 'Super Admin', email: 'admin@zymgoo.com' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setError('Please enter your username, email or mobile number');
      return;
    }
    if (!password.trim()) {
      setError('Please enter your password');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const res = await api.auth.login({ email: identifier, password });
      if (res.token) {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
      }
      onLogin(res.user || {
        username: identifier.includes('@') ? identifier.split('@')[0] : identifier,
        role: 'Super Admin',
        email: identifier.includes('@') ? identifier : `${identifier}@zymgoo.com`
      });
    } catch (err) {
      setError(err.message || 'Login failed. Check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-wrapper">
        {/* Brand Header */}
        <div className="login-brand-header">
          <div className="login-logo-icon">
            <Zap size={30} fill="currentColor" strokeWidth={0} />
          </div>
          <h1>Zymgoo CRM</h1>
          <p>Admin Panel - Sign in to continue</p>
        </div>

        {/* Login Card */}
        <div className="login-card">
          {/* Demo Login Banner */}
          <div className="demo-banner-box">
            <div className="demo-banner-text">
              <span className="demo-banner-title">Demo Credentials</span>
              <span className="demo-banner-sub">admin@zymgoo.com / admin123</span>
            </div>
            <button
              type="button"
              className="btn-fill-demo"
              onClick={handleFillDemo}
              title="Autofill form with Demo credentials"
            >
              Fill Demo
            </button>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {error && <div className="login-error-msg">{error}</div>}

            {/* Username / Email Field */}
            <div className="login-field-group">
              <label className="login-field-label">Username, Email or Mobile</label>
              <div className="login-input-wrapper">
                <span className="input-leading-icon">
                  <User size={18} />
                </span>
                <input
                  type="text"
                  className="login-input-field"
                  placeholder="Enter username, email or mobile"
                  value={identifier}
                  onChange={(e) => { setIdentifier(e.target.value); setError(''); }}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="login-field-group">
              <label className="login-field-label">Password</label>
              <div className="login-input-wrapper">
                <span className="input-leading-icon">
                  <Lock size={18} />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="login-input-field"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password Row */}
            <div className="login-options-row">
              <label className="remember-label">
                <input
                  type="checkbox"
                  className="remember-checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me</span>
              </label>

              <a
                href="#forgot"
                className="forgot-password-link"
                onClick={(e) => {
                  e.preventDefault();
                  alert('Demo Mode: Enter password "admin123" or click "Fill Demo" above.');
                }}
              >
                Forgot password?
              </a>
            </div>

            {/* Sign In Button */}
            <button type="submit" className="btn-login-submit" disabled={isLoading}>
              {isLoading ? (
                <span>Signing In...</span>
              ) : (
                <>
                  <LogIn size={18} />
                  <span>Sign In to Dashboard</span>
                </>
              )}
            </button>

            {/* Quick 1-Click Demo Login */}
            <button
              type="button"
              className="btn-quick-demo"
              onClick={handleDemoDirectLogin}
              disabled={isLoading}
            >
              <Sparkles size={16} style={{ color: '#F05223' }} />
              <span>One-Click Demo Sign In</span>
            </button>
          </form>
        </div>

        {/* Footer */}
        <footer className="login-footer-copy">
          © 2026 Zymgoo. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
