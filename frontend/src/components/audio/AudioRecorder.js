import React from 'react';
import WaveformVisualizer from './WaveformVisualizer';
import RecordingControls from './RecordingControls';
import AudioPlayer from './AudioPlayer';
import { RECORDING_STATUS, AUDIO_CONFIG } from '../../constants/audio';
import { formatDuration } from '../../utils/formatters';
import './audio.css';

/**
 * Main audio recorder component.
 * Combines waveform, timer, controls, and playback into one interface.
 */
const AudioRecorder = ({
  status,
  duration,
  audioUrl,
  analyser,
  error,
  onStart,
  onStop,
  onPause,
  onResume,
  onReset,
}) => {
  const isRecording = status === RECORDING_STATUS.RECORDING;
  const isPaused = status === RECORDING_STATUS.PAUSED;
  const isStopped = status === RECORDING_STATUS.STOPPED;

  const getColor = () => {
    if (isRecording) return AUDIO_CONFIG.BAR_COLOR_RECORDING;
    if (isPaused) return '#f59e0b';
    return AUDIO_CONFIG.BAR_COLOR_IDLE;
  };

  return (
    <div className="audio-recorder">
      {/* Status indicator */}
      <div className="recorder-status">
        <span className={`status-dot ${isRecording ? 'recording' : ''} ${isPaused ? 'paused' : ''}`} />
        <span className="status-text">
          {status === RECORDING_STATUS.IDLE && 'Ready to record'}
          {isRecording && 'Recording...'}
          {isPaused && 'Paused'}
          {isStopped && 'Recording complete'}
        </span>
      </div>

      {/* Timer */}
      <div className={`recorder-timer ${isRecording ? 'active' : ''}`}>
        <span className="timer-current">{formatDuration(duration)}</span>
        <span className="timer-separator">/</span>
        <span className="timer-max">{formatDuration(AUDIO_CONFIG.MAX_DURATION_SECONDS)}</span>
      </div>

      {/* Waveform */}
      <WaveformVisualizer
        analyser={analyser}
        isActive={isRecording}
        color={getColor()}
      />

      {/* Error */}
      {error && (
        <div className="recorder-error">
          <span>⚠️</span>
          <p>{error}</p>
        </div>
      )}

      {/* Controls */}
      <RecordingControls
        status={status}
        onStart={onStart}
        onStop={onStop}
        onPause={onPause}
        onResume={onResume}
        onReset={onReset}
      />

      {/* Playback preview */}
      {isStopped && audioUrl && (
        <div className="recorder-preview">
          <h4 className="preview-title">Preview Recording</h4>
          <AudioPlayer audioUrl={audioUrl} duration={duration} />
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
