import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import audioApiService from '../../services/audioService';
import { UPLOAD_STATUS } from '../../constants/audio';

// Async thunk: Upload recording with progress
export const uploadRecording = createAsyncThunk(
  'upload/uploadRecording',
  async ({ audioBlob, metadata }, { dispatch, rejectWithValue }) => {
    try {
      const response = await audioApiService.upload(audioBlob, metadata, (progress) => {
        dispatch(setUploadProgress(progress));
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Upload failed';
      return rejectWithValue(message);
    }
  }
);

// Async thunk: Fetch recording history
export const fetchHistory = createAsyncThunk(
  'upload/fetchHistory',
  async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      const response = await audioApiService.getHistory(page, limit);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch history';
      return rejectWithValue(message);
    }
  }
);

// Async thunk: Delete a recording
export const deleteRecording = createAsyncThunk(
  'upload/deleteRecording',
  async (id, { rejectWithValue }) => {
    try {
      await audioApiService.delete(id);
      return id;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete';
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  uploadProgress: 0,
  uploadStatus: UPLOAD_STATUS.IDLE,
  uploadError: null,
  history: [],
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  historyLoading: false,
  historyError: null,
};

const uploadSlice = createSlice({
  name: 'upload',
  initialState,
  reducers: {
    setUploadProgress(state, action) {
      state.uploadProgress = action.payload;
    },
    resetUpload(state) {
      state.uploadProgress = 0;
      state.uploadStatus = UPLOAD_STATUS.IDLE;
      state.uploadError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Upload
      .addCase(uploadRecording.pending, (state) => {
        state.uploadStatus = UPLOAD_STATUS.UPLOADING;
        state.uploadProgress = 0;
        state.uploadError = null;
      })
      .addCase(uploadRecording.fulfilled, (state) => {
        state.uploadStatus = UPLOAD_STATUS.SUCCESS;
        state.uploadProgress = 100;
      })
      .addCase(uploadRecording.rejected, (state, action) => {
        state.uploadStatus = UPLOAD_STATUS.FAILED;
        state.uploadError = action.payload;
      })
      // History
      .addCase(fetchHistory.pending, (state) => {
        state.historyLoading = true;
        state.historyError = null;
      })
      .addCase(fetchHistory.fulfilled, (state, action) => {
        state.historyLoading = false;
        state.history = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchHistory.rejected, (state, action) => {
        state.historyLoading = false;
        state.historyError = action.payload;
      })
      // Delete
      .addCase(deleteRecording.fulfilled, (state, action) => {
        state.history = state.history.filter((r) => r.id !== action.payload);
        state.pagination.total -= 1;
      });
  },
});

export const { setUploadProgress, resetUpload } = uploadSlice.actions;
export default uploadSlice.reducer;
