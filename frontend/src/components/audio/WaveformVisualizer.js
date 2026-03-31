import React, { useRef, useEffect } from 'react';
import { AUDIO_CONFIG } from '../../constants/audio';
import './audio.css';

/**
 * Real-time waveform visualizer using Web Audio API.
 * Draws animated bars from AnalyserNode frequency data.
 */
const WaveformVisualizer = ({ analyser, isActive, color }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;

      ctx.clearRect(0, 0, width, height);

      if (analyser && isActive) {
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);

        const barWidth = AUDIO_CONFIG.BAR_WIDTH;
        const barGap = AUDIO_CONFIG.BAR_GAP;
        const totalBarWidth = barWidth + barGap;
        const barCount = Math.floor(width / totalBarWidth);
        const step = Math.floor(bufferLength / barCount);

        for (let i = 0; i < barCount; i++) {
          const value = dataArray[i * step] || 0;
          const barHeight = Math.max(2, (value / 255) * height * 0.85);
          const x = i * totalBarWidth;
          const y = (height - barHeight) / 2;

          const gradient = ctx.createLinearGradient(x, y, x, y + barHeight);
          gradient.addColorStop(0, color || AUDIO_CONFIG.BAR_COLOR_RECORDING);
          gradient.addColorStop(1, `${color || AUDIO_CONFIG.BAR_COLOR_RECORDING}88`);

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.roundRect(x, y, barWidth, barHeight, 2);
          ctx.fill();
        }
      } else {
        // Draw idle waveform (static bars)
        const barCount = Math.floor(width / (AUDIO_CONFIG.BAR_WIDTH + AUDIO_CONFIG.BAR_GAP));
        for (let i = 0; i < barCount; i++) {
          const barHeight = 2 + Math.sin(i * 0.3 + Date.now() * 0.001) * 3;
          const x = i * (AUDIO_CONFIG.BAR_WIDTH + AUDIO_CONFIG.BAR_GAP);
          const y = (height - barHeight) / 2;

          ctx.fillStyle = 'rgba(100, 116, 139, 0.3)';
          ctx.beginPath();
          ctx.roundRect(x, y, AUDIO_CONFIG.BAR_WIDTH, barHeight, 1);
          ctx.fill();
        }
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [analyser, isActive, color]);

  return (
    <div className="waveform-container">
      <canvas ref={canvasRef} className="waveform-canvas" />
    </div>
  );
};

export default WaveformVisualizer;
