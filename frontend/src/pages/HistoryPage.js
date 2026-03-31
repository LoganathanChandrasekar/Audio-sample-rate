import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHistory, deleteRecording } from '../store/slices/uploadSlice';
import { addToast } from '../store/slices/uiSlice';
import HistoryList from '../components/history/HistoryList';
import AudioPlayer from '../components/audio/AudioPlayer';
import Modal from '../components/common/Modal';
import audioService from '../services/audioService';
import './pages.css';

const HistoryPage = () => {
  const dispatch = useDispatch();
  const { history, historyLoading, historyError, pagination } = useSelector(
    (state) => state.upload
  );
  const [deletingId, setDeletingId] = useState(null);
  const [playModal, setPlayModal] = useState({ open: false, recording: null });

  useEffect(() => {
    dispatch(fetchHistory({ page: 1, limit: 10 }));
  }, [dispatch]);

  const handlePageChange = (page) => {
    dispatch(fetchHistory({ page, limit: 10 }));
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this recording?')) return;

    setDeletingId(id);
    const result = await dispatch(deleteRecording(id));
    setDeletingId(null);

    if (deleteRecording.fulfilled.match(result)) {
      dispatch(addToast({ type: 'success', message: 'Recording deleted' }));
    } else {
      dispatch(addToast({ type: 'error', message: 'Failed to delete recording' }));
    }
  };

  const handlePlay = (recording) => {
    const streamUrl = audioService.getStreamUrl(recording.id);
    setPlayModal({ open: true, recording: { ...recording, streamUrl } });
  };

  return (
    <div className="history-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Recording History</h1>
          <p className="page-description">
            {pagination?.total
              ? `${pagination.total} recording${pagination.total !== 1 ? 's' : ''} total`
              : 'Manage your audio recordings'}
          </p>
        </div>
      </div>

      <HistoryList
        recordings={history}
        loading={historyLoading}
        error={historyError}
        pagination={pagination}
        onPlay={handlePlay}
        onDelete={handleDelete}
        onPageChange={handlePageChange}
        deletingId={deletingId}
      />

      {/* Playback Modal */}
      <Modal
        isOpen={playModal.open}
        onClose={() => setPlayModal({ open: false, recording: null })}
        title={playModal.recording?.fileName || 'Playback'}
        size="md"
      >
        {playModal.recording && (
          <div className="playback-modal-content">
            <AudioPlayer
              audioUrl={playModal.recording.streamUrl}
              duration={playModal.recording.duration}
            />
            <div className="playback-meta">
              <div className="playback-meta-item">
                <span className="meta-label">Format</span>
                <span className="meta-value">{playModal.recording.format?.toUpperCase()}</span>
              </div>
              <div className="playback-meta-item">
                <span className="meta-label">Sample Rate</span>
                <span className="meta-value">{playModal.recording.sampleRate} Hz</span>
              </div>
              <div className="playback-meta-item">
                <span className="meta-label">Duration</span>
                <span className="meta-value">
                  {Math.round(playModal.recording.duration)}s
                </span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default HistoryPage;
