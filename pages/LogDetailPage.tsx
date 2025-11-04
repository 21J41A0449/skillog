
import React, { useState, useEffect } from 'react';
import { LogEntry, Comment } from '../types';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';
import CommentSection from '../components/CommentSection';
import { UserIcon, StarIcon } from '../components/icons';
import TagLink from '../components/TagLink';

interface LogDetailPageProps {
    logId: string;
    currentUser: User;
    upvotedItems: Set<string>;
    onUpvote: (id: string, type: 'log' | 'comment', authorId: string) => void;
}

const LogDetailCard = ({ log }: { log: LogEntry }) => (
    <div className="bg-surface p-5 rounded-xl border border-border">
        <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-surface-light rounded-full flex items-center justify-center text-text-primary border border-border">
                    <UserIcon className="w-5 h-5" />
                </div>
                <div>
                    <p className="font-semibold text-text-primary">{log.profiles?.display_name || 'Anonymous'}</p>
                    <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                        <StarIcon className="w-3 h-3 text-accent-primary" />
                        <span>{log.profiles?.reputation || 0}</span>
                        <span className="mx-1">·</span>
                        <span>{new Date(log.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                </div>
            </div>
            <span className="text-2xl" aria-label={`Mood: ${log.mood}`}>{log.mood}</span>
        </div>
        <p className="mt-4 text-text-primary whitespace-pre-wrap">{log.text}</p>
        {log.tags && log.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
                {log.tags.map((tag) => (
                    <TagLink key={tag} tag={tag} />
                ))}
            </div>
        )}
    </div>
);

export default function LogDetailPage({ logId, currentUser, upvotedItems, onUpvote }: LogDetailPageProps) {
    const [log, setLog] = useState<LogEntry | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogAndComments = async () => {
            setLoading(true);
            try {
                const { data: logData, error: logError } = await supabase
                    .from('learning_logs')
                    .select('*, profiles(id, full_name, avatar_url, reputation)')
                    .eq('id', logId)
                    .single();
                
                if (logError) throw logError;
                setLog(logData as any);

                const { data: commentsData, error: commentsError } = await supabase
                    .from('comments')
                    .select('*, profiles(id, full_name, avatar_url, reputation)')
                    .eq('log_id', logId)
                    .order('created_at', { ascending: true });

                if (commentsError) throw commentsError;
                setComments(commentsData as any);

            } catch (error) {
                console.error("Error fetching log details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLogAndComments();
    }, [logId]);

    const handleAddComment = (newComment: Comment) => {
        setComments(prev => [...prev, newComment]);
    }

    if (loading) {
        return <div className="text-center text-text-secondary">Loading log...</div>;
    }

    if (!log) {
        return <div className="text-center text-accent-primary">Log not found.</div>;
    }

    return (
        <div className="animate-fade-in space-y-8">
            <LogDetailCard log={log} />
            <CommentSection
                logId={logId}
                initialComments={comments}
                currentUser={currentUser}
                onCommentAdded={handleAddComment}
                upvotedItems={upvotedItems}
                onUpvote={onUpvote}
            />
        </div>
    );
}
