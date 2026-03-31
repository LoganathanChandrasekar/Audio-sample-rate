import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import useAudioRecorder from '../hooks/useAudioRecorder';
import useIndexedDB from '../hooks/useIndexedDB';
import useMediaDevices from '../hooks/useMediaDevices';
import AudioRecorder from '../components/audio/AudioRecorder';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { uploadRecording, resetUpload } from '../store/slices/uploadSlice';
import { resetRecording } from '../store/slices/audioSlice';
import { addToast } from '../store/slices/uiSlice';
import { RECORDING_STATUS, UPLOAD_STATUS } from '../constants/audio';
import { formatDuration, formatFileSize } from '../utils/formatters';
import './pages.css';

const RecordPage = () => {
  const dispatch = useDispatch();
  const { uploadStatus, uploadProgress, uploadError } = useSelector((state) => state.upload);
  const {
    status,
    duration,
    audioBlob,
    audioUrl,
    analyser,
    error: recorderError,
    start,
    stop,
    pause,
    resume,
    reset,
  } = useAudioRecorder();

  const { saveRecording, markUploaded } = useIndexedDB();
  const { hasMicrophone, permissionStatus, requestPermission } = useMediaDevices();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [localSaveId, setLocalSaveId] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset: resetForm,
  } = useForm();

  const handleStopAndShowUpload = useCallback(() => {
    stop();
    // Small delay to ensure blob is ready
    setTimeout(() => setShowUploadModal(true), 300);
  }, [stop]);

  const handleSaveLocal = async () => {
    if (!audioBlob) return;

    try {
      const saved = await saveRecording({
        blob: audioBlob,
        duration,
        format: audioBlob.type?.split('/')[1] || 'webm',
        mimeType: audioBlob.type,
        sampleRate: 44100,
      });
      setLocalSaveId(saved.id);
      dispatch(addToast({ type: 'success', message: 'Recording saved locally' }));
    } catch (err) {
      dispatch(addToast({ type: 'error', message: 'Failed to save locally' }));
    }
  };

  const handleUpload = async (formData) => {
    if (!audioBlob) return;

    const metadata = {
      fileName: formData.fileName,
      duration,
      format: audioBlob.type?.split('/')[1] || 'webm',
      sampleRate: 44100,
    };

    const result = await dispatch(uploadRecording({ audioBlob, metadata }));

    if (uploadRecording.fulfilled.match(result)) {
      dispatch(addToast({ type: 'success', message: 'Audio uploaded successfully!' }));

      // Mark local copy as uploaded
      if (localSaveId) {
        await markUploaded(localSaveId);
      }

      // Reset everything
      setShowUploadModal(false);
      reset();
      resetForm();
      dispatch(resetRecording());
      dispatch(resetUpload());
      setLocalSaveId(null);
    } else {
      dispatch(addToast({ type: 'error', message: uploadError || 'Upload failed' }));
    }
  };

  const handleNewRecording = () => {
    reset();
    resetForm();
    dispatch(resetRecording());
    dispatch(resetUpload());
    setShowUploadModal(false);
    setLocalSaveId(null);
  };

  return (
    <div className="record-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Record Audio</h1>
          <p className="page-description">
            {hasMicrophone
              ? 'Your microphone is ready. Start recording when you\'re ready.'
              : 'Please connect a microphone to start recording.'}
          </p>
        </div>
      </div>

      {/* Permission warning */}
      {permissionStatus === 'denied' && (
        <div className="permission-warning">
          <span>🔒</span>
          <div>
            <h4>Microphone Access Denied</h4>
            <p>Please enable microphone access in your browser settings to record audio.</p>
          </div>
        </div>
      )}

      {permissionStatus === 'prompt' && (
        <div className="permission-prompt">
          <span>🎙️</span>
          <div>
            <h4>Microphone Permission Required</h4>
            <p>Click below to grant microphone access for recording.</p>
          </div>
          <Button variant="primary" size="sm" onClick={requestPermission}>
            Allow Microphone
          </Button>
        </div>
      )}

      {/* Recorder */}
      <AudioRecorder
        status={status}
        duration={duration}
        audioUrl={audioUrl}
        analyser={analyser}
        error={recorderError}
        onStart={start}
        onStop={handleStopAndShowUpload}
        onPause={pause}
        onResume={resume}
        onReset={handleNewRecording}
      />

      {/* Bottom actions when stopped */}
      {status === RECORDING_STATUS.STOPPED && audioBlob && (
        <div className="record-actions">
          <div className="recording-meta-info">
            <span>📋 Duration: {formatDuration(duration)}</span>
            <span>📦 Size: {formatFileSize(audioBlob.size)}</span>
            <span>🎵 Format: {audioBlob.type?.split('/')[1]?.toUpperCase() || 'WEBM'}</span>
          </div>
          <div className="record-action-buttons">
            <Button variant="secondary" size="md" onClick={handleSaveLocal} icon="💾">
              Save Locally
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => setShowUploadModal(true)}
              icon="☁️"
            >
              Upload
            </Button>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      <Modal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        title="Upload Recording"
        size="sm"
      >
        <form onSubmit={handleSubmit(handleUpload)} className="upload-form">
          <Input
            label="Recording Name"
            placeholder="Enter a name for your recording"
            error={errors.fileName?.message}
            {...register('fileName', {
              required: 'File name is required',
              maxLength: { value: 200, message: 'Name too long' },
              pattern: {
                value: /^[a-zA-Z0-9_\-\s.]+$/,
                message: 'Only letters, numbers, spaces, hyphens, and underscores',
              },
            })}
          />

          <div className="upload-meta">
            <span>⏱️ {formatDuration(duration)}</span>
            <span>📦 {audioBlob ? formatFileSize(audioBlob.size) : '—'}</span>
          </div>

          {uploadStatus === UPLOAD_STATUS.UPLOADING && (
            <div className="upload-progress">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <span className="progress-text">{uploadProgress}%</span>
            </div>
          )}

          {uploadError && (
            <div className="upload-error">⚠️ {uploadError}</div>
          )}

          <div className="upload-actions">
            <Button
              variant="secondary"
              size="md"
              onClick={() => setShowUploadModal(false)}
              type="button"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              type="submit"
              loading={uploadStatus === UPLOAD_STATUS.UPLOADING}
              id="btn-upload-confirm"
            >
              Upload
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default RecordPage;
