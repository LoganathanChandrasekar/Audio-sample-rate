import { useState, useRef, useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AUDIO_CONFIG, RECORDING_STATUS } from '../constants/audio';
import {
  setRecordingStatus,
  setAudioBlob,
  setAudioUrl,
  setDuration,
  setMetadata,
} from '../store/slices/audioSlice';

/**
 * Custom hook for audio recording using MediaRecorder API.
 * Manages recording lifecycle: start, stop, pause, resume, reset.
 */
const useAudioRecorder = () => {
  const dispatch = useDispatch();
  const [status, setStatus] = useState(RECORDING_STATUS.IDLE);
  const [currentDuration, setCurrentDuration] = useState(0);
  const [blob, setBlob] = useState(null);
  const [url, setUrl] = useState(null);
  const [error, setError] = useState(null);

  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);
  const pausedDurationRef = useRef(0);
  const analyserRef = useRef(null);
  const audioContextRef = useRef(null);
  const durationRef = useRef(0);

  // Keep durationRef in sync with state
  useEffect(() => {
    durationRef.current = currentDuration;
  }, [currentDuration]);

  // Get supported MIME type
  const getSupportedMimeType = useCallback(() => {
    for (const type of AUDIO_CONFIG.FALLBACK_MIME_TYPES) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }
    return '';
  }, []);

  // Stop timer
  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Stop recording
  const stop = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    stopTimer();
    setStatus(RECORDING_STATUS.STOPPED);
    dispatch(setRecordingStatus(RECORDING_STATUS.STOPPED));
    dispatch(setDuration(durationRef.current));
  }, [dispatch, stopTimer]);

  // Start timer
  const startTimer = useCallback(() => {
    startTimeRef.current = Date.now() - pausedDurationRef.current * 1000;
    timerRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      setCurrentDuration(elapsed);

      // Auto-stop at max duration
      if (elapsed >= AUDIO_CONFIG.MAX_DURATION_SECONDS) {
        stop();
      }
    }, AUDIO_CONFIG.TIMER_UPDATE_INTERVAL);
  }, [stop]);

  // Start recording
  const start = useCallback(async () => {
    try {
      setError(null);
      chunksRef.current = [];
      pausedDurationRef.current = 0;

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: AUDIO_CONFIG.SAMPLE_RATE,
          channelCount: AUDIO_CONFIG.CHANNELS,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      streamRef.current = stream;

      // Set up audio context for visualization
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = AUDIO_CONFIG.FFT_SIZE;
      source.connect(analyser);
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;

      const mimeType = getSupportedMimeType();
      const recorder = new MediaRecorder(stream, {
        mimeType: mimeType || undefined,
      });

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const recordedBlob = new Blob(chunksRef.current, { type: mimeType || 'audio/webm' });
        const recordedUrl = URL.createObjectURL(recordedBlob);

        setBlob(recordedBlob);
        setUrl(recordedUrl);
        dispatch(setAudioBlob(recordedBlob));
        dispatch(setAudioUrl(recordedUrl));
        dispatch(setDuration(durationRef.current));
        dispatch(setMetadata({
          format: (mimeType || 'audio/webm').split('/')[1],
          sampleRate: audioContext.sampleRate,
          mimeType: mimeType || 'audio/webm',
        }));
      };

      mediaRecorderRef.current = recorder;
      recorder.start(100); // Collect data every 100ms

      setStatus(RECORDING_STATUS.RECORDING);
      dispatch(setRecordingStatus(RECORDING_STATUS.RECORDING));
      startTimer();
    } catch (err) {
      let message = 'Failed to access microphone';
      if (err.name === 'NotAllowedError') {
        message = 'Microphone access denied. Please allow microphone permission.';
      } else if (err.name === 'NotFoundError') {
        message = 'No microphone found. Please connect a microphone.';
      }
      setError(message);
      console.error('Recording error:', err);
    }
  }, [dispatch, getSupportedMimeType, startTimer]);

  // Pause recording
  const pause = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause();
      pausedDurationRef.current = durationRef.current;
      stopTimer();
      setStatus(RECORDING_STATUS.PAUSED);
      dispatch(setRecordingStatus(RECORDING_STATUS.PAUSED));
    }
  }, [dispatch, stopTimer]);

  // Resume recording
  const resume = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume();
      startTimer();
      setStatus(RECORDING_STATUS.RECORDING);
      dispatch(setRecordingStatus(RECORDING_STATUS.RECORDING));
    }
  }, [dispatch, startTimer]);

  // Reset everything
  const reset = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
    }
    stopTimer();
    chunksRef.current = [];
    pausedDurationRef.current = 0;
    setCurrentDuration(0);
    setBlob(null);
    setUrl((prevUrl) => {
      if (prevUrl) URL.revokeObjectURL(prevUrl);
      return null;
    });
    setError(null);
    setStatus(RECORDING_STATUS.IDLE);
    dispatch(setRecordingStatus(RECORDING_STATUS.IDLE));
  }, [dispatch, stopTimer]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return {
    status,
    duration: currentDuration,
    audioBlob: blob,
    audioUrl: url,
    error,
    analyser: analyserRef.current,
    isRecording: status === RECORDING_STATUS.RECORDING,
    isPaused: status === RECORDING_STATUS.PAUSED,
    isStopped: status === RECORDING_STATUS.STOPPED,
    isIdle: status === RECORDING_STATUS.IDLE,
    start,
    stop,
    pause,
    resume,
    reset,
  };
};

export default useAudioRecorder;
