
import React, { useState, useMemo } from 'react';
import { LogEntry } from '../types';
import LogCard from '../components/LogCard';

interface FeedPageProps {
    logs: LogEntry[];
    upvotedItems: Set<string>;
    onUpvote: (id: string, type: 'log' | 'comment', authorId: string) => void;
}

type SortByType = 'trending' | 'top';

export default function FeedPage({ logs, upvotedItems, onUpvote }: FeedPageProps) {
    const [sortBy, setSortBy] = useState<SortByType>('trending');

    const sortedLogs = useMemo(() => {
        const logsCopy = [...logs];
        if (sortBy === 'top') {
            return logsCopy.sort((a, b) => b.upvotes - a.upvotes);
        }
        // Default to 'trending' (newest first)
        return logsCopy.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }, [logs, sortBy]);

    return (
        <div className="animate-fade-in space-y-6">
            <div className="flex items-center gap-2 p-1 bg-surface border border-border rounded-lg w-fit">
                <button 
                    onClick={() => setSortBy('trending')}
                    className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${sortBy === 'trending' ? 'bg-surface-light text-text-primary' : 'text-text-secondary hover:text-text-primary'}`}
                >
                    Trending
                </button>
                <button 
                    onClick={() => setSortBy('top')}
                    className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${sortBy === 'top' ? 'bg-surface-light text-text-primary' : 'text-text-secondary hover:text-text-primary'}`}
                >
                    Top
                </button>
            </div>

            <div className="space-y-4">
                {sortedLogs.length > 0 ? (
                    sortedLogs.map(log => <LogCard key={log.id} log={log} upvotedItems={upvotedItems} onUpvote={onUpvote} />)
                ) : (
                    <div className="text-center py-20">
                        <p className="text-text-secondary">The community feed is quiet right now...</p>
                        <p className="text-text-primary mt-1">Be the first to share what you're learning!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
