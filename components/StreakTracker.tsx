
import React, { useMemo } from 'react';
import { LogEntry } from '../types';
import { calculateStreak } from '../lib/utils';

interface StreakTrackerProps {
  logs: LogEntry[];
}

export default function StreakTracker({ logs }: StreakTrackerProps) {
  const streak = useMemo(() => calculateStreak(logs), [logs]);

  return (
    <div className="bg-surface p-5 rounded-xl border border-border flex items-center justify-center gap-4">
      <span className="text-5xl">🔥</span>
      <div>
        <p className="text-2xl font-bold text-text-primary">{streak} {streak === 1 ? 'day' : 'days'} in a row</p>
        <p className="text-text-secondary">{streak > 0 ? "Keep up the great work!" : "Log today to start a new streak!"}</p>
      </div>
    </div>
  );
}
