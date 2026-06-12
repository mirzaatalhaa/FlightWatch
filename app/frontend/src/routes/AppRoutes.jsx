import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Layouts
import AppLayout from '../layouts/AppLayout';
import AuthLayout from '../layouts/AuthLayout';

// Pages
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import SightingsPage from '../pages/SightingsPage';
import ProfilePage from '../pages/ProfilePage';

// Route guards to protect routing navigation
const FallbackRoute = () => {
  const { user } = useAuth();
  // Redirect to dashboard if logged in, otherwise back to home
  return <Navigate to={user ? "/dashboard" : "/"} replace />;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<LandingPage />} />

      {/* Auth Pages (Redirect if already logged in) */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* App Pages (Dashboard/Private, Redirect if not logged in) */}
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/sightings" element={<SightingsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      {/* Wildcard Fallback */}
      <Route path="*" element={<FallbackRoute />} />
    </Routes>
  );
};

export default AppRoutes;
