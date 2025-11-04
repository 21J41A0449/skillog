
import React from 'react';
import { LogEntry } from '../types';
import LogForm from '../components/LogForm';
import StreakTracker from '../components/StreakTracker';
import { GlobeIcon, LockIcon, GitHubIcon, ExternalLinkIcon } from '../components/icons';

interface DashboardPageProps {
    logs: LogEntry[];
    onAddLog: (newLog: Omit<LogEntry, 'id' | 'user_id' | 'created_at' | 'upvotes'>) => Promise<void>;
}

const DashboardLogCard = ({ log }: { log: LogEntry }) => (
    <div className="bg-surface p-4 rounded-xl border border-border">
        <div className="flex justify-between items-center">
            <p className="text-sm text-text-secondary">{new Date(log.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</p>
            {log.is_public ? (
                <div className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-accent-secondary bg-accent-secondary/10 rounded-full">
                    <GlobeIcon className="w-3 h-3" />
                    <span>Public</span>
                </div>
            ) : (
                <div className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-accent-primary bg-accent-primary/10 rounded-full">
                    <LockIcon className="w-3 h-3" />
                    <span>Private</span>
                </div>
            )}
        </div>
        <p className="mt-2 text-text-primary">{log.text}</p>
        {(log.github_url || log.live_url) && (
            <div className="mt-3 flex flex-wrap gap-3">
                {log.github_url && (
                    <a href={log.github_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-2 py-1 text-xs font-semibold bg-surface-light text-text-secondary rounded-md border border-border hover:border-accent-primary/50 hover:text-text-primary">
                        <GitHubIcon className="w-4 h-4" /> View Code
                    </a>
                )}
                {log.live_url && (
                    <a href={log.live_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-2 py-1 text-xs font-semibold bg-surface-light text-text-secondary rounded-md border border-border hover:border-accent-primary/50 hover:text-text-primary">
                        <ExternalLinkIcon className="w-4 h-4" /> Live Demo
                    </a>
                )}
            </div>
      )}
    </div>
);

export default function DashboardPage({
    logs,
    onAddLog,
}: DashboardPageProps) {
    const userLogs = logs;

    return (
        <div className="space-y-8">
            <div className="bg-surface border border-border rounded-2xl p-8">
                <h1 className="text-3xl sm:text-4xl font-bold text-text-primary">My Dashboard</h1>
                <p className="mt-2 text-text-secondary max-w-2xl">This is your personal space. Add logs, track your streak, and manage your learning journey.</p>
            </div>
            <LogForm onAddLog={onAddLog} />
            <div className="w-full h-px bg-border"></div>
            <StreakTracker logs={logs} />
            <div>
                <h2 className="text-xl font-bold text-text-primary mb-4">My Entries</h2>
                {userLogs.length > 0 ? (
                    <div className="space-y-4">
                        {userLogs.map(log => (
                            <DashboardLogCard key={log.id} log={log} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10 px-6 bg-surface rounded-xl border border-border">
                        <p className="text-text-secondary">You have no entries yet. Post your first log to start building your proof-of-work!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
