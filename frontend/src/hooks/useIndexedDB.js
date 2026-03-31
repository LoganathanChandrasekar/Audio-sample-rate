import { useState, useCallback } from 'react';
import indexedDBService from '../services/indexedDBService';

/**
 * Custom hook for IndexedDB operations.
 * Provides CRUD operations for local audio recording persistence.
 */
const useIndexedDB = () => {
  const [localRecordings, setLocalRecordings] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const loadRecordings = useCallback(async () => {
    setLoading(true);
    try {
      const recordings = await indexedDBService.getAll();
      setLocalRecordings(recordings.reverse()); // newest first
      const count = await indexedDBService.getPendingCount();
      setPendingCount(count);
    } catch (err) {
      console.error('Failed to load local recordings:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveRecording = useCallback(async (recording) => {
    try {
      const saved = await indexedDBService.save(recording);
      await loadRecordings();
      return saved;
    } catch (err) {
      console.error('Failed to save recording locally:', err);
      throw err;
    }
  }, [loadRecordings]);

  const deleteRecording = useCallback(async (id) => {
    try {
      await indexedDBService.delete(id);
      await loadRecordings();
    } catch (err) {
      console.error('Failed to delete local recording:', err);
      throw err;
    }
  }, [loadRecordings]);

  const markUploaded = useCallback(async (id) => {
    try {
      await indexedDBService.updateStatus(id, 'uploaded');
      await loadRecordings();
    } catch (err) {
      console.error('Failed to mark recording as uploaded:', err);
    }
  }, [loadRecordings]);

  const clearUploaded = useCallback(async () => {
    try {
      await indexedDBService.clearUploaded();
      await loadRecordings();
    } catch (err) {
      console.error('Failed to clear uploaded recordings:', err);
    }
  }, [loadRecordings]);

  return {
    localRecordings,
    pendingCount,
    loading,
    loadRecordings,
    saveRecording,
    deleteRecording,
    markUploaded,
    clearUploaded,
  };
};

export default useIndexedDB;
