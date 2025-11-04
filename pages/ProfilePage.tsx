
import React, { useState, useEffect, useMemo } from 'react';
import { Profile, LogEntry, Comment, User } from '../types';
import { supabase } from '../lib/supabaseClient';
import { UserIcon, StarIcon, BriefcaseIcon } from '../components/icons';
import LogCard from '../components/LogCard';

interface ProfilePageProps {
    profileId: string;
    currentUser: User;
    onConnect?: (profile: Profile) => void;
}

const StatCard = ({ label, value }: { label: string, value: string | number }) => (
    <div className="bg-surface-light p-4 rounded-lg border border-border text-center">
        <p className="text-2xl font-bold text-text-primary">{value}</p>
        <p className="text-xs text-text-secondary uppercase">{label}</p>
    </div>
);

const SkillCloud = ({ logs }: { logs: LogEntry[] }) => {
    const tags = useMemo(() => {
        const tagCounts = logs.flatMap(log => log.tags).reduce((acc, tag) => {
            acc[tag] = (acc[tag] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        return Object.entries(tagCounts).sort((a, b) => b[1] - a[1]).slice(0, 10);
    }, [logs]);

    return (
        <div className="flex flex-wrap gap-2">
            {tags.map(([tag, count]) => (
                <a key={tag} href={`#/circle/${tag}`} className="px-3 py-1 bg-surface-light text-sm text-text-secondary font-medium rounded-full border border-border hover:border-accent-secondary hover:text-accent-secondary transition-colors">
                    #{tag} <span className="text-xs opacity-75">{count}</span>
                </a>
            ))}
        </div>
    );
};

export default function ProfilePage({ profileId, currentUser, onConnect }: ProfilePageProps) {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'logs' | 'comments'>('logs');

    const isRecruiterView = profile?.role === 'recruiter';

    useEffect(() => {
        const fetchProfileData = async () => {
            setLoading(true);
            try {
                const { data: profileData, error: profileError } = await supabase.from('profiles').select('*').eq('id', profileId).single();
                if (profileError) throw profileError;
                setProfile(profileData);

                const { data: logsData, error: logsError } = await supabase.from('learning_logs').select('*, profiles!inner(*)').eq('user_id', profileId).eq('is_public', true).order('created_at', { ascending: false });
                if(logsError) throw logsError;
                setLogs(logsData as any);

                const { data: commentsData, error: commentsError } = await supabase.from('comments').select('*').eq('user_id', profileId).order('created_at', { ascending: false });
                if(commentsError) throw commentsError;
                setComments(commentsData);

            } catch (error) {
                console.error("Error fetching profile data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfileData();
    }, [profileId]);

    if (loading) return <div className="text-center text-text-secondary">Loading Profile...</div>;
    if (!profile) return <div className="text-center text-accent-primary">Profile not found.</div>;

    return (
        <div className="animate-fade-in space-y-8">
            <div className="bg-surface border border-border rounded-2xl p-8">
                <div className="flex flex-col sm:flex-row items-start gap-6">
                    <div className="w-24 h-24 bg-surface-light rounded-full flex items-center justify-center text-text-primary border-2 border-border flex-shrink-0">
                        <UserIcon className="w-12 h-12" />
                    </div>
                    <div className="flex-grow">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-3xl font-bold text-text-primary">{profile.display_name}</h1>
                                <p className="text-text-secondary">Member since {new Date(profile.id.includes('mock') ? Date.now() : profile.id).toLocaleDateString()}</p>
                            </div>
                            {profile.is_open_to_work && (
                                <div className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold bg-accent-primary/20 text-accent-primary rounded-full border border-accent-primary/50">
                                    <BriefcaseIcon className="w-4 h-4" />
                                    OPEN TO WORK
                                </div>
                            )}
                        </div>
                        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                            <StatCard label="Reputation" value={profile.reputation} />
                            <StatCard label="Logs" value={logs.length} />
                            <StatCard label="Comments" value={comments.length} />
                            <StatCard label="Streak" value={0} />
                        </div>
                    </div>
                </div>
                {isRecruiterView && profile.is_open_to_work && onConnect && (
                     <div className="mt-6 pt-6 border-t border-border">
                        <button onClick={() => onConnect(profile)} className="w-full py-3 text-base font-bold bg-gradient-to-r from-accent-primary to-accent-primary-dark text-white rounded-lg shadow-lg hover:opacity-90 transition-opacity">
                            Contact {profile.display_name.split(' ')[0]}
                        </button>
                    </div>
                )}
                <div className="mt-6 pt-6 border-t border-border">
                    <h3 className="text-sm font-semibold text-text-secondary uppercase mb-3">Top Skills</h3>
                    <SkillCloud logs={logs} />
                </div>
            </div>

            <div>
                <div className="border-b border-border mb-6">
                    <nav className="-mb-px flex gap-6" aria-label="Tabs">
                        <button onClick={() => setActiveTab('logs')} className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'logs' ? 'border-accent-primary text-accent-primary' : 'border-transparent text-text-secondary hover:text-text-primary hover:border-border'}`}>
                            Public Logs
                        </button>
                        <button onClick={() => setActiveTab('comments')} className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'comments' ? 'border-accent-primary text-accent-primary' : 'border-transparent text-text-secondary hover:text-text-primary hover:border-border'}`}>
                            Top Comments
                        </button>
                    </nav>
                </div>
                <div className="space-y-4">
                    {activeTab === 'logs' && (logs.length > 0 ? logs.map(log => <LogCard key={log.id} log={log} upvotedItems={new Set()} onUpvote={() => {}} />) : <p className="text-text-secondary text-center py-8">This user hasn't posted any public logs yet.</p>)}
                    {activeTab === 'comments' && (comments.length > 0 ? comments.map(comment => (
                        <div key={comment.id} className="bg-surface p-4 rounded-xl border border-border">
                            <p className="text-text-primary">{comment.content}</p>
                            <p className="text-xs text-text-secondary mt-2">Commented on <a href={`#/log/${comment.log_id}`} className="underline hover:text-accent-primary">a log</a></p>
                        </div>
                    )) : <p className="text-text-secondary text-center py-8">This user hasn't made any comments yet.</p>)}
                </div>
            </div>
        </div>
    );
}
