import React from 'react';
import { RECORDING_STATUS } from '../../constants/audio';
import Button from '../common/Button';
import './audio.css';

/**
 * Recording controls: Start, Stop, Pause, Resume, Re-record.
 */
const RecordingControls = ({ status, onStart, onStop, onPause, onResume, onReset }) => {
  return (
    <div className="recording-controls">
      {status === RECORDING_STATUS.IDLE && (
        <Button
          id="btn-start-recording"
          variant="danger"
          size="lg"
          onClick={onStart}
          icon="🎙️"
        >
          Start Recording
        </Button>
      )}

      {status === RECORDING_STATUS.RECORDING && (
        <div className="controls-row">
          <Button
            id="btn-pause-recording"
            variant="secondary"
            size="md"
            onClick={onPause}
            icon="⏸"
          >
            Pause
          </Button>
          <button
            id="btn-stop-recording"
            className="stop-btn"
            onClick={onStop}
            aria-label="Stop Recording"
          >
            <span className="stop-icon" />
          </button>
        </div>
      )}

      {status === RECORDING_STATUS.PAUSED && (
        <div className="controls-row">
          <Button
            id="btn-resume-recording"
            variant="primary"
            size="md"
            onClick={onResume}
            icon="▶"
          >
            Resume
          </Button>
          <button
            id="btn-stop-recording-paused"
            className="stop-btn"
            onClick={onStop}
            aria-label="Stop Recording"
          >
            <span className="stop-icon" />
          </button>
        </div>
      )}

      {status === RECORDING_STATUS.STOPPED && (
        <div className="controls-row">
          <Button
            id="btn-re-record"
            variant="secondary"
            size="md"
            onClick={onReset}
            icon="🔄"
          >
            Re-record
          </Button>
        </div>
      )}
    </div>
  );
};

export default RecordingControls;
