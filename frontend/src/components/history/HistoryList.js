import React from 'react';
import HistoryCard from './HistoryCard';
import Spinner from '../common/Spinner';
import Button from '../common/Button';
import './history.css';

/**
 * List of recording history cards with pagination and empty state.
 */
const HistoryList = ({
  recordings,
  loading,
  error,
  pagination,
  onPlay,
  onDelete,
  onPageChange,
  deletingId,
}) => {
  if (loading) {
    return (
      <div className="history-loading">
        <Spinner size="lg" text="Loading recordings..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="history-error">
        <p>⚠️ {error}</p>
      </div>
    );
  }

  if (!recordings || recordings.length === 0) {
    return (
      <div className="history-empty">
        <div className="empty-icon">🎙️</div>
        <h3>No recordings yet</h3>
        <p>Start recording your first audio to see it here.</p>
      </div>
    );
  }

  return (
    <div className="history-list">
      <div className="history-items">
        {recordings.map((recording) => (
          <HistoryCard
            key={recording.id}
            recording={recording}
            onPlay={onPlay}
            onDelete={onDelete}
            isDeleting={deletingId === recording.id}
          />
        ))}
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="history-pagination">
          <Button
            variant="secondary"
            size="sm"
            disabled={pagination.page <= 1}
            onClick={() => onPageChange(pagination.page - 1)}
          >
            ← Previous
          </Button>
          <span className="pagination-info">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <Button
            variant="secondary"
            size="sm"
            disabled={pagination.page >= pagination.totalPages}
            onClick={() => onPageChange(pagination.page + 1)}
          >
            Next →
          </Button>
        </div>
      )}
    </div>
  );
};

export default HistoryList;
