import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_USERS } from '../data/mockData';
const API_URL = import.meta.env.VITE_API_URL;
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize Auth State from backend API using JWT
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('flightwatch_token');
      if (token) {
        try {
          const res = await fetch('/api/v1/auth/profile', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          const data = await res.json();
          if (data.success) {
            setUser(data.user);
          } else {
            // Clear invalid/expired token session
            localStorage.removeItem('flightwatch_token');
            localStorage.removeItem('flightwatch_user');
          }
        } catch (err) {
          console.error('Failed to fetch user profile:', err);
          // Fallback to offline cached user if present
          const cachedUser = localStorage.getItem('flightwatch_user');
          if (cachedUser) {
            setUser(JSON.parse(cachedUser));
          }
        }
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  const login = (email, password) => {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await fetch(`${API_URL}/api/v1/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
        });
        
        const data = await res.json();
        
        if (!res.ok || !data.success) {
          return reject(new Error(data.message || 'Invalid email or password.'));
        }
        
        setUser(data.user);
        localStorage.setItem('flightwatch_token', data.token);
        localStorage.setItem('flightwatch_user', JSON.stringify(data.user));
        resolve(data.user);
      } catch (err) {
        reject(new Error('Network error. Failed to connect to server.'));
      }
    });
  };

  const register = (name, email, password) => {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await fetch(`${API_URL}/api/v1/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name, email, password })
        });
        
        const data = await res.json();
        
        if (!res.ok || !data.success) {
          return reject(new Error(data.message || 'Registration failed.'));
        }
        
        setUser(data.user);
        localStorage.setItem('flightwatch_token', data.token);
        localStorage.setItem('flightwatch_user', JSON.stringify(data.user));
        resolve(data.user);
      } catch (err) {
        reject(new Error('Network error. Failed to connect to server.'));
      }
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('flightwatch_token');
    localStorage.removeItem('flightwatch_user');
  };

  const updateUserProfile = async (updatedDetails) => {
    if (!user) return;
    const token = localStorage.getItem('flightwatch_token');
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/api/v1/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: updatedDetails.name })
      });
      
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        localStorage.setItem('flightwatch_user', JSON.stringify(data.user));
      } else {
        console.error('Failed to update profile:', data.message);
      }
    } catch (err) {
      console.error('Failed to update profile network error:', err);
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUserProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
