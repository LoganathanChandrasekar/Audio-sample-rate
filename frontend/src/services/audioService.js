import api from './api';
import { API_ENDPOINTS } from '../constants/api';

/**
 * Audio Service — handles upload, history, and management API calls.
 */
const audioService = {
  /**
   * Upload audio file with metadata.
   * Uses FormData for multipart upload with progress tracking.
   */
  async upload(audioBlob, metadata, onProgress) {
    const formData = new FormData();
    
    // Create a file from the blob with proper extension
    const extension = metadata.format || 'webm';
    const file = new File([audioBlob], `${metadata.fileName}.${extension}`, {
      type: audioBlob.type || 'audio/webm',
    });

    formData.append('audio', file);
    formData.append('fileName', metadata.fileName);
    formData.append('duration', metadata.duration.toString());
    formData.append('format', metadata.format || 'webm');
    formData.append('sampleRate', (metadata.sampleRate || 44100).toString());

    const response = await api.post(API_ENDPOINTS.AUDIO.UPLOAD, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percent);
        }
      },
    });

    return response.data;
  },

  /**
   * Get paginated recording history
   */
  async getHistory(page = 1, limit = 10) {
    const response = await api.get(API_ENDPOINTS.AUDIO.HISTORY, {
      params: { page, limit },
    });
    return response.data;
  },

  /**
   * Get a single audio record by ID
   */
  async getById(id) {
    const response = await api.get(API_ENDPOINTS.AUDIO.GET_BY_ID(id));
    return response.data;
  },

  /**
   * Get streaming URL for audio playback
   */
  getStreamUrl(id) {
    const token = localStorage.getItem('token');
    return `${api.defaults.baseURL}${API_ENDPOINTS.AUDIO.STREAM(id)}?token=${token}`;
  },

  /**
   * Delete an audio record
   */
  async delete(id) {
    const response = await api.delete(API_ENDPOINTS.AUDIO.DELETE(id));
    return response.data;
  },
};

export default audioService;
