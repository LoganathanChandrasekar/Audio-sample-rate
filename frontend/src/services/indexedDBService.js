import { openDB } from 'idb';
import { IDB_CONFIG } from '../constants/audio';

/**
 * IndexedDB Service — Local persistence for audio recordings.
 * Stores recordings locally before upload to prevent data loss.
 */

let dbPromise = null;

const getDB = () => {
  if (!dbPromise) {
    dbPromise = openDB(IDB_CONFIG.DB_NAME, IDB_CONFIG.DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(IDB_CONFIG.STORE_NAME)) {
          const store = db.createObjectStore(IDB_CONFIG.STORE_NAME, {
            keyPath: 'id',
            autoIncrement: true,
          });
          store.createIndex('createdAt', 'createdAt');
          store.createIndex('uploadStatus', 'uploadStatus');
        }
      },
    });
  }
  return dbPromise;
};

const indexedDBService = {
  /**
   * Save a recording locally
   */
  async save(recording) {
    const db = await getDB();
    const data = {
      ...recording,
      createdAt: new Date().toISOString(),
      uploadStatus: 'pending',
    };
    const id = await db.add(IDB_CONFIG.STORE_NAME, data);
    return { ...data, id };
  },

  /**
   * Get all local recordings
   */
  async getAll() {
    const db = await getDB();
    return db.getAllFromIndex(IDB_CONFIG.STORE_NAME, 'createdAt');
  },

  /**
   * Get pending (not yet uploaded) recordings
   */
  async getPending() {
    const db = await getDB();
    return db.getAllFromIndex(IDB_CONFIG.STORE_NAME, 'uploadStatus', 'pending');
  },

  /**
   * Get a recording by ID
   */
  async getById(id) {
    const db = await getDB();
    return db.get(IDB_CONFIG.STORE_NAME, id);
  },

  /**
   * Update upload status of a recording
   */
  async updateStatus(id, status) {
    const db = await getDB();
    const record = await db.get(IDB_CONFIG.STORE_NAME, id);
    if (record) {
      record.uploadStatus = status;
      await db.put(IDB_CONFIG.STORE_NAME, record);
    }
    return record;
  },

  /**
   * Delete a recording from local storage
   */
  async delete(id) {
    const db = await getDB();
    await db.delete(IDB_CONFIG.STORE_NAME, id);
  },

  /**
   * Clear all uploaded recordings from local storage
   */
  async clearUploaded() {
    const db = await getDB();
    const all = await db.getAll(IDB_CONFIG.STORE_NAME);
    const uploaded = all.filter((r) => r.uploadStatus === 'uploaded');
    for (const record of uploaded) {
      await db.delete(IDB_CONFIG.STORE_NAME, record.id);
    }
  },

  /**
   * Get count of pending uploads
   */
  async getPendingCount() {
    const db = await getDB();
    const pending = await db.getAllFromIndex(IDB_CONFIG.STORE_NAME, 'uploadStatus', 'pending');
    return pending.length;
  },
};

export default indexedDBService;
