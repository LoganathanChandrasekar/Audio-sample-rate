import React from 'react';
import { Outlet } from 'react-router-dom';
import './layouts.css';

/**
 * Auth layout — Centered card layout for login/register pages.
 */
const AuthLayout = () => {
  return (
    <div className="auth-layout">
      <div className="auth-bg-gradient" />
      <div className="auth-container">
        <div className="auth-brand">
          <div className="brand-icon">🎙️</div>
          <h1 className="brand-title">SampleRate</h1>
          <p className="brand-subtitle">Professional Audio Recording Studio</p>
        </div>
        <div className="auth-card">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
