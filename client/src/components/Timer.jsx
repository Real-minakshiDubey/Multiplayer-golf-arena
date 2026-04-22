import { useState, useEffect } from 'react';

export default function Timer({ endTime, onTimeUp }) {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
        onTimeUp?.();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [endTime]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isLow = timeLeft <= 30;
  const isCritical = timeLeft <= 10;

  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-2xl font-bold
      ${isCritical ? 'bg-red-500/20 text-red-400 animate-pulse-fast' :
        isLow ? 'bg-accent-yellow/20 text-accent-yellow' :
        'bg-dark-700 text-white'}`}>
      <span>⏱️</span>
      <span>{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</span>
    </div>
  );
}