import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AlertCircle } from 'lucide-react';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) { setError('Name is required.'); return; }
    if (!email.trim()) { setError('Email is required.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }

    setIsSubmitting(true);
    try {
      await register(name.trim(), email.trim(), password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-card-header">
        <h1 className="auth-card-title">Register</h1>
        <p className="auth-card-subtitle">Create your FlightWatch account to begin logging spots.</p>
      </div>

      {error && (
        <div className="error-banner mb-3">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="register-name">Full Name</label>
          <input 
            id="register-name" 
            type="text" 
            className="form-control"
            placeholder="John Doe" 
            value={name}
            onChange={(e) => setName(e.target.value)} 
            disabled={isSubmitting} 
            required 
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="register-email">Email Address</label>
          <input 
            id="register-email" 
            type="email" 
            className="form-control"
            placeholder="name@example.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
            disabled={isSubmitting} 
            required 
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="register-password">Password</label>
          <input 
            id="register-password" 
            type="password" 
            className="form-control"
            placeholder="At least 6 characters" 
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
            disabled={isSubmitting} 
            required 
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="register-confirm-password">Confirm Password</label>
          <input 
            id="register-confirm-password" 
            type="password" 
            className="form-control"
            placeholder="Confirm password" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)} 
            disabled={isSubmitting} 
            required 
          />
        </div>

        <button 
          type="submit" 
          className="btn btn-primary mt-3" 
          style={{ width: '100%' }} 
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Registering...' : 'Create Account'}
        </button>
      </form>

      <div className="auth-card-footer">
        <span>Already have an account?</span>
        <Link to="/login">Sign In</Link>
      </div>
    </div>
  );
};

export default RegisterPage;
