import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email) { setError('Email is required.'); return; }
    if (!password) { setError('Password is required.'); return; }

    setIsSubmitting(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-card-header">
        <h1 className="auth-card-title">Sign In</h1>
        <p className="auth-card-subtitle">Authenticate to access your FlightWatch ledger.</p>
      </div>

      {error && (
        <div className="error-banner mb-3">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="email-input">Email Address</label>
          <input
            id="email-input"
            type="email"
            className="form-control"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting}
            required
          />
        </div>

        <div className="form-group" style={{ position: 'relative' }}>
          <label className="form-label" htmlFor="password-input">Password</label>
          <div style={{ position: 'relative' }}>
            <input
              id="password-input"
              type={showPassword ? 'text' : 'password'}
              className="form-control"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting}
              required
              style={{ paddingRight: '44px' }}
            />
            <button
              type="button"
              style={{
                position: 'absolute', 
                right: '12px', 
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none', 
                border: 'none', 
                color: 'var(--color-ink-muted-48)', 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '4px'
              }}
              onClick={() => setShowPassword(!showPassword)}
              tabIndex="-1"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary mt-3"
          style={{ width: '100%' }}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      <div className="auth-card-footer">
        <span>New to FlightWatch?</span>
        <Link to="/register">Create an account</Link>
      </div>
    </div>
  );
};

export default LoginPage;
