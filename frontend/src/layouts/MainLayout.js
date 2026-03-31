import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { ROUTES } from '../constants/routes';
import './layouts.css';

/**
 * Main application layout with sidebar navigation.
 */
const MainLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate(ROUTES.LOGIN);
  };

  const navItems = [
    { path: ROUTES.DASHBOARD, label: 'Dashboard', icon: '📊' },
    { path: ROUTES.RECORD, label: 'Record', icon: '🎙️' },
    { path: ROUTES.HISTORY, label: 'History', icon: '📁' },
  ];

  return (
    <div className="main-layout">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <span className="sidebar-brand-icon">🎙️</span>
            <span className="sidebar-brand-text">SampleRate</span>
          </div>
          <button
            className="sidebar-close-btn"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            ✕
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `nav-link ${isActive ? 'active' : ''}`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="user-details">
              <span className="user-name">{user?.name || 'User'}</span>
              <span className="user-email">{user?.email || ''}</span>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout} id="btn-logout">
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="main-content">
        <header className="top-bar">
          <button
            className="hamburger-btn"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <span /><span /><span />
          </button>
          <div className="top-bar-right">
            <span className="welcome-text">Welcome, {user?.name?.split(' ')[0] || 'User'}</span>
          </div>
        </header>

        <div className="page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
