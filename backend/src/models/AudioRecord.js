const mongoose = require('mongoose');

const audioRecordSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    fileName: {
      type: String,
      required: [true, 'File name is required'],
      trim: true,
    },
    originalName: {
      type: String,
      required: [true, 'Original file name is required'],
    },
    duration: {
      type: Number,
      required: [true, 'Duration is required'],
      min: [0, 'Duration cannot be negative'],
    },
    format: {
      type: String,
      required: [true, 'Audio format is required'],
      enum: {
        values: ['webm', 'ogg', 'wav', 'mp3', 'mp4'],
        message: 'Format must be webm, ogg, wav, mp3, or mp4',
      },
    },
    sampleRate: {
      type: Number,
      required: [true, 'Sample rate is required'],
      min: [8000, 'Sample rate must be at least 8000 Hz'],
      max: [96000, 'Sample rate cannot exceed 96000 Hz'],
    },
    fileSize: {
      type: Number,
      default: 0,
    },
    mimeType: {
      type: String,
      required: [true, 'MIME type is required'],
    },
    filePath: {
      type: String,
      required: [true, 'File path is required'],
    },
    uploadStatus: {
      type: String,
      enum: {
        values: ['pending', 'completed', 'failed'],
        message: 'Upload status must be pending, completed, or failed',
      },
      default: 'completed',
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient user queries
audioRecordSchema.index({ userId: 1, createdAt: -1 });

const AudioRecord = mongoose.model('AudioRecord', audioRecordSchema);

module.exports = AudioRecord;
