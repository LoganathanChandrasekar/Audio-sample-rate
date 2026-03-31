import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchHistory } from '../store/slices/uploadSlice';
import useIndexedDB from '../hooks/useIndexedDB';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';
import { ROUTES } from '../constants/routes';
import { formatDuration } from '../utils/formatters';
import './pages.css';

const DashboardPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { history, historyLoading, pagination } = useSelector((state) => state.upload);
  const { pendingCount, loadRecordings } = useIndexedDB();

  useEffect(() => {
    dispatch(fetchHistory({ page: 1, limit: 5 }));
    loadRecordings();
  }, [dispatch, loadRecordings]);

  const totalRecordings = pagination?.total || 0;
  const recentRecordings = history?.slice(0, 5) || [];
  const totalDuration = recentRecordings.reduce((sum, r) => sum + (r.duration || 0), 0);

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-description">Welcome back, {user?.name?.split(' ')[0] || 'User'}!</p>
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={() => navigate(ROUTES.RECORD)}
          icon="🎙️"
          id="btn-quick-record"
        >
          New Recording
        </Button>
      </div>

      {/* Stats cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon stat-icon-purple">🎵</div>
          <div className="stat-info">
            <span className="stat-value">{totalRecordings}</span>
            <span className="stat-label">Total Recordings</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon-green">⏱️</div>
          <div className="stat-info">
            <span className="stat-value">{formatDuration(totalDuration)}</span>
            <span className="stat-label">Recent Duration</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon-amber">📤</div>
          <div className="stat-info">
            <span className="stat-value">{pendingCount}</span>
            <span className="stat-label">Pending Uploads</span>
          </div>
        </div>
      </div>

      {/* Recent recordings */}
      <div className="dashboard-section">
        <div className="section-header">
          <h2 className="section-title">Recent Recordings</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(ROUTES.HISTORY)}
          >
            View All →
          </Button>
        </div>

        {historyLoading ? (
          <Spinner size="md" text="Loading..." />
        ) : recentRecordings.length > 0 ? (
          <div className="recent-list">
            {recentRecordings.map((rec) => (
              <div key={rec.id} className="recent-item">
                <div className="recent-item-icon">🎵</div>
                <div className="recent-item-info">
                  <span className="recent-item-name">{rec.fileName}</span>
                  <span className="recent-item-meta">
                    {formatDuration(rec.duration)} · {rec.format?.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-section">
            <p>No recordings yet. Start your first recording!</p>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate(ROUTES.RECORD)}
            >
              Record Now
            </Button>
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="dashboard-section">
        <h2 className="section-title">Quick Actions</h2>
        <div className="actions-grid">
          <button className="action-card" onClick={() => navigate(ROUTES.RECORD)}>
            <span className="action-icon">🎙️</span>
            <span className="action-label">Record Audio</span>
            <span className="action-desc">Start a new recording session</span>
          </button>
          <button className="action-card" onClick={() => navigate(ROUTES.HISTORY)}>
            <span className="action-icon">📁</span>
            <span className="action-label">My Recordings</span>
            <span className="action-desc">Browse and manage recordings</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
