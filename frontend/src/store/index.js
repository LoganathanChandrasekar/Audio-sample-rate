import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import audioReducer from './slices/audioSlice';
import uploadReducer from './slices/uploadSlice';
import uiReducer from './slices/uiSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    audio: audioReducer,
    upload: uploadReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore non-serializable blob data in audio slice
        ignoredActions: ['audio/setAudioBlob', 'audio/setAudioUrl'],
        ignoredPaths: ['audio.audioBlob'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
