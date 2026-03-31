import { createSlice } from '@reduxjs/toolkit';
import { RECORDING_STATUS } from '../../constants/audio';

const initialState = {
  recordingStatus: RECORDING_STATUS.IDLE,
  audioBlob: null,
  audioUrl: null,
  duration: 0,
  metadata: {
    fileName: '',
    format: 'webm',
    sampleRate: 44100,
    mimeType: 'audio/webm',
  },
};

const audioSlice = createSlice({
  name: 'audio',
  initialState,
  reducers: {
    setRecordingStatus(state, action) {
      state.recordingStatus = action.payload;
    },
    setAudioBlob(state, action) {
      state.audioBlob = action.payload;
    },
    setAudioUrl(state, action) {
      state.audioUrl = action.payload;
    },
    setDuration(state, action) {
      state.duration = action.payload;
    },
    setMetadata(state, action) {
      state.metadata = { ...state.metadata, ...action.payload };
    },
    setFileName(state, action) {
      state.metadata.fileName = action.payload;
    },
    resetRecording(state) {
      if (state.audioUrl) {
        URL.revokeObjectURL(state.audioUrl);
      }
      state.recordingStatus = RECORDING_STATUS.IDLE;
      state.audioBlob = null;
      state.audioUrl = null;
      state.duration = 0;
      state.metadata.fileName = '';
    },
  },
});

export const {
  setRecordingStatus,
  setAudioBlob,
  setAudioUrl,
  setDuration,
  setMetadata,
  setFileName,
  resetRecording,
} = audioSlice.actions;

export default audioSlice.reducer;
