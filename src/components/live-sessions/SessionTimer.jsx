'use client';

import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

export default function SessionTimer({ startedAt }) {
  const [duration, setDuration] = useState('00:00:00');

  useEffect(() => {
    if (!startedAt) return;

    const updateDuration = () => {
      const start = new Date(startedAt);
      const now = new Date();
      const diff = now - start;

      // Calculate hours, minutes, seconds
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      // Format as HH:MM:SS
      const formatted = [
        hours.toString().padStart(2, '0'),
        minutes.toString().padStart(2, '0'),
        seconds.toString().padStart(2, '0'),
      ].join(':');

      setDuration(formatted);
    };

    // Update immediately
    updateDuration();

    // Update every second
    const interval = setInterval(updateDuration, 1000);

    return () => clearInterval(interval);
  }, [startedAt]);

  if (!startedAt) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full border border-primary/20">
      <Clock className="w-4 h-4 text-primary" />
      <span className="text-sm font-mono font-semibold text-primary">
        {duration}
      </span>
    </div>
  );
}
