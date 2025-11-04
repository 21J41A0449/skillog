
import { LogEntry } from '../types';

const getDayFromDate = (date: Date): string => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d.toISOString().split('T')[0];
};

export const calculateStreak = (logs: LogEntry[]): number => {
    if (logs.length === 0) {
        return 0;
    }

    // FIX: Use `created_at` for streak calculation as `date` is not reliably set.
    const logDates = new Set(logs.map(log => getDayFromDate(new Date(log.created_at))));

    let streak = 0;
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    let currentDate = new Date();

    if (logDates.has(getDayFromDate(today))) {
        streak = 1;
        currentDate.setDate(currentDate.getDate() - 1);
    } else if (logDates.has(getDayFromDate(yesterday))) {
        streak = 1;
        currentDate.setDate(currentDate.getDate() - 2);
    } else {
        return 0;
    }

    while (logDates.has(getDayFromDate(currentDate))) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
    }

    return streak;
};
