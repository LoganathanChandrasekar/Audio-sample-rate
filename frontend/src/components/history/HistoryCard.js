import React from 'react';
import { formatDuration, formatFileSize, formatDate } from '../../utils/formatters';
import Button from '../common/Button';
import './history.css';

/**
 * Single recording history card.
 */
const HistoryCard = ({ recording, onPlay, onDelete, isDeleting }) => {
  const formatBadge = recording.format?.toUpperCase() || 'WEBM';

  return (
    <div className="history-card">
      <div className="history-card-left">
        <button
          className="history-play-btn"
          onClick={() => onPlay(recording)}
          aria-label="Play recording"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
        <div className="history-card-info">
          <h4 className="history-card-name">{recording.fileName}</h4>
          <p className="history-card-meta">
            <span>{formatDuration(recording.duration)}</span>
            <span className="meta-dot">·</span>
            <span>{formatFileSize(recording.fileSize)}</span>
            <span className="meta-dot">·</span>
            <span className="format-badge">{formatBadge}</span>
          </p>
        </div>
      </div>
      <div className="history-card-right">
        <span className="history-card-date">{formatDate(recording.createdAt)}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(recording.id)}
          loading={isDeleting}
          id={`btn-delete-${recording.id}`}
        >
          🗑️
        </Button>
      </div>
    </div>
  );
};

export default HistoryCard;
