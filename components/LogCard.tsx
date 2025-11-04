
import React from 'react';
import { LogEntry } from '../types';
import { User } from '@supabase/supabase-js';
import { UserIcon, CommentIcon, UpvoteIcon, StarIcon, GitHubIcon, ExternalLinkIcon, CloseIcon } from './icons';
import TagLink from './TagLink';

interface LogCardProps {
  log: LogEntry;
  currentUser: User;
  upvotedItems: Set<string>;
  onUpvote: (id: string, type: 'log' | 'comment', authorId: string) => void;
  onDelete?: (logId: string) => void;
}

export default function LogCard({ log, currentUser, upvotedItems, onUpvote, onDelete }: LogCardProps) {
  const formattedDate = new Date(log.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const isUpvoted = upvotedItems.has(log.id);

  const handleUpvoteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onUpvote(log.id, 'log', log.user_id);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this log entry?')) {
      onDelete?.(log.id);
    }
  };

  const isOwnLog = log.user_id === currentUser.id;

  return (
    <div className="bg-surface p-5 rounded-xl border border-border hover:border-accent-primary/50 transition-colors duration-300 animate-fade-in">
      <div className="flex justify-between items-start">
        <a href={`#/profile/${log.user_id}`} className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-surface-light rounded-full flex items-center justify-center text-text-primary border border-border group-hover:border-accent-primary transition-colors">
                <UserIcon className="w-5 h-5" />
            </div>
            <div>
                <p className="font-semibold text-text-primary group-hover:text-accent-primary transition-colors">{log.profiles?.display_name || 'Anonymous'}</p>
                <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                    <StarIcon className="w-3 h-3 text-accent-primary" />
                    <span>{log.profiles?.reputation || 0}</span>
                    <span className="mx-1">·</span>
                    <span>{formattedDate}</span>
                </div>
            </div>
        </a>
        <span className="text-2xl" aria-label={`Mood: ${log.mood}`}>{log.mood}</span>
      </div>
      <a href={`#/log/${log.id}`} className="block">
        <p className="mt-4 text-text-primary whitespace-pre-wrap">{log.text}</p>
      </a>
      {(log.github_url || log.live_url) && (
        <div className="mt-4 flex flex-wrap gap-3">
            {log.github_url && (
                <a href={log.github_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold bg-surface-light text-text-primary rounded-lg border border-border hover:border-accent-primary/50">
                    <GitHubIcon className="w-4 h-4" /> View Code
                </a>
            )}
            {log.live_url && (
                 <a href={log.live_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold bg-surface-light text-text-primary rounded-lg border border-border hover:border-accent-primary/50">
                    <ExternalLinkIcon className="w-4 h-4" /> Live Demo
                </a>
            )}
        </div>
      )}
      {log.tags && log.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {log.tags.map((tag) => (
            <TagLink key={tag} tag={tag} />
          ))}
        </div>
      )}
      <div className="mt-4 pt-4 border-t border-border flex items-center gap-6 text-text-secondary">
        <button onClick={handleUpvoteClick} className={`flex items-center gap-2 hover:text-accent-primary transition-colors ${isUpvoted ? 'text-accent-primary' : ''}`}>
            <UpvoteIcon />
            <span className="text-sm font-medium">{log.upvotes + (isUpvoted ? 1 : 0)}</span>
        </button>
        <a href={`#/log/${log.id}`} className="flex items-center gap-2 hover:text-text-primary">
            <CommentIcon />
            <span className="text-sm font-medium">{log.comment_count || 0}</span>
        </a>
        {isOwnLog && onDelete && (
          <button onClick={handleDeleteClick} className="flex items-center gap-2 hover:text-red-500 transition-colors text-red-400">
            <CloseIcon />
            <span className="text-sm font-medium">Delete</span>
          </button>
        )}
      </div>
    </div>
  );
}
