
import React, { useState } from 'react';
import { Comment } from '../types';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';
import { UserIcon, UpvoteIcon, StarIcon } from './icons';

interface CommentSectionProps {
    logId: string;
    initialComments: Comment[];
    currentUser: User;
    onCommentAdded: (comment: Comment) => void;
    upvotedItems: Set<string>;
    onUpvote: (id: string, type: 'log' | 'comment', authorId: string) => void;
}

const CommentItem = ({ comment, onUpvote, isUpvoted }: { comment: Comment, onUpvote: (id: string, type: 'log' | 'comment', authorId: string) => void, isUpvoted: boolean }) => {
    const handleUpvoteClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onUpvote(comment.id, 'comment', comment.user_id);
    };

    return (
        <div className="flex gap-4">
            <div className="w-8 h-8 bg-surface-light rounded-full flex items-center justify-center text-text-primary border border-border flex-shrink-0 mt-1">
                <UserIcon />
            </div>
            <div className="flex-1">
                <div className="bg-surface-light p-3 rounded-lg border border-border">
                    <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm text-text-primary">{comment.profiles?.display_name || 'Anonymous'}</p>
                        <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                            <StarIcon className="w-3 h-3 text-accent-primary" />
                            <span>{comment.profiles?.reputation || 0}</span>
                        </div>
                    </div>
                    <p className="mt-2 text-text-primary">{comment.content}</p>
                </div>
                <div className="mt-2 flex items-center gap-4 text-text-secondary">
                    <button onClick={handleUpvoteClick} className={`flex items-center gap-1.5 hover:text-accent-primary transition-colors ${isUpvoted ? 'text-accent-primary' : ''}`}>
                        <UpvoteIcon className="w-4 h-4" />
                        <span className="text-xs font-medium">{comment.upvotes + (isUpvoted ? 1 : 0)}</span>
                    </button>
                    <span className="text-xs">{new Date(comment.created_at).toLocaleDateString()}</span>
                </div>
            </div>
        </div>
    );
};

export default function CommentSection({ logId, initialComments, currentUser, onCommentAdded, upvotedItems, onUpvote }: CommentSectionProps) {
    const [comments, setComments] = useState(initialComments);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        setLoading(true);

        const { data, error } = await supabase
            .from('comments')
            .insert({ log_id: logId, user_id: currentUser.id, content: newComment })
            .select('*, profiles(id, full_name, avatar_url, reputation)')
            .single();

        if (error) {
            console.error("Error posting comment:", error);
        } else if (data) {
            onCommentAdded(data as any);
            setNewComment('');
        }
        setLoading(false);
    };

    return (
        <div className="bg-surface p-6 rounded-xl border border-border">
            <h3 className="text-lg font-bold text-text-primary mb-4">Discussion ({comments.length})</h3>
            <div className="space-y-6">
                {comments.map(comment => <CommentItem key={comment.id} comment={comment} onUpvote={onUpvote} isUpvoted={upvotedItems.has(comment.id)} />)}
            </div>

            <form onSubmit={handleSubmit} className="mt-8 flex gap-4 items-start">
                <div className="w-10 h-10 bg-surface-light rounded-full flex items-center justify-center text-text-primary border border-border flex-shrink-0">
                    <UserIcon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add to the discussion..."
                        className="w-full p-3 bg-surface-light rounded-lg border border-border focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/50 transition-colors placeholder-text-secondary text-text-primary"
                        rows={3}
                        disabled={loading}
                    />
                    <div className="mt-2 flex justify-end">
                        <button type="submit" disabled={loading} className="px-4 py-2 bg-gradient-to-r from-accent-primary to-accent-primary-dark text-white font-semibold rounded-lg shadow-md hover:opacity-90 transition-opacity disabled:opacity-50">
                            {loading ? 'Posting...' : 'Post Comment'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
