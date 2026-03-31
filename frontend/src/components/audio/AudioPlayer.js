import React, { useRef, useState, useEffect } from 'react';
import { formatDuration } from '../../utils/formatters';
import './audio.css';

/**
 * Audio player for previewing recorded audio.
 * Features: play/pause, seek bar, time display.
 */
const AudioPlayer = ({ audioUrl, duration }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(duration || 0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => {
      if (audio.duration && isFinite(audio.duration)) {
        setAudioDuration(audio.duration);
      }
    };
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audioUrl]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (!audio) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = x / rect.width;
    const time = percent * (audioDuration || duration);
    audio.currentTime = time;
    setCurrentTime(time);
  };

  const progress = audioDuration ? (currentTime / audioDuration) * 100 : 0;

  if (!audioUrl) return null;

  return (
    <div className="audio-player">
      <audio ref={audioRef} src={audioUrl} preload="metadata" crossOrigin="anonymous" />

      <button
        id="btn-play-pause"
        className={`player-play-btn ${isPlaying ? 'playing' : ''}`}
        onClick={togglePlay}
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? (
          <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>

      <div className="player-time">{formatDuration(currentTime)}</div>

      <div className="player-progress" onClick={handleSeek}>
        <div className="player-progress-track">
          <div className="player-progress-fill" style={{ width: `${progress}%` }} />
          <div className="player-progress-thumb" style={{ left: `${progress}%` }} />
        </div>
      </div>

      <div className="player-time">{formatDuration(audioDuration || duration)}</div>
    </div>
  );
};

export default AudioPlayer;
