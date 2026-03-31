// Audio recording configuration constants
export const AUDIO_CONFIG = {
  // MediaRecorder settings
  MIME_TYPE: 'audio/webm',
  FALLBACK_MIME_TYPES: ['audio/webm', 'audio/ogg', 'audio/wav'],
  SAMPLE_RATE: 44100,
  CHANNELS: 1,
  BITS_PER_SAMPLE: 16,

  // Recording limits
  MAX_DURATION_SECONDS: 1800, // 30 minutes
  MAX_FILE_SIZE_BYTES: 52428800, // 50MB

  // Waveform visualizer
  FFT_SIZE: 256,
  BAR_WIDTH: 3,
  BAR_GAP: 1,
  BAR_COLOR_RECORDING: '#ef4444',
  BAR_COLOR_IDLE: '#6366f1',
  BAR_COLOR_PLAYING: '#10b981',

  // Timer format
  TIMER_UPDATE_INTERVAL: 100, // ms
};

export const RECORDING_STATUS = {
  IDLE: 'idle',
  RECORDING: 'recording',
  PAUSED: 'paused',
  STOPPED: 'stopped',
  PREVIEWING: 'previewing',
};

export const UPLOAD_STATUS = {
  IDLE: 'idle',
  UPLOADING: 'uploading',
  SUCCESS: 'success',
  FAILED: 'failed',
};

// IndexedDB configuration
export const IDB_CONFIG = {
  DB_NAME: 'samplerate-audio-db',
  DB_VERSION: 1,
  STORE_NAME: 'recordings',
};
