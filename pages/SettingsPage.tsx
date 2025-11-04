
import React, { useState, useEffect } from 'react';
import { User, Profile, OutreachMessage } from '../types';
import { UserIcon, BriefcaseIcon } from '../components/icons';
import { api } from '../lib/api';
import { supabase } from '../lib/supabaseClient';

interface SettingsPageProps {
    user: User;
    profile: Profile;
    onProfileUpdate: () => void;
}

const SettingsCard = ({ title, children, noPadding }: { title: string, children: React.ReactNode, noPadding?: boolean }) => (
    <div className="bg-surface border border-border rounded-xl">
        <div className="p-6 border-b border-border">
            <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
        </div>
        <div className={noPadding ? '' : 'p-6'}>
            {children}
        </div>
    </div>
);

const Toggle = ({ checked, onChange }: { checked: boolean, onChange: (checked: boolean) => void }) => (
    <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`${
            checked ? 'bg-accent-primary' : 'bg-surface-light'
        } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-surface`}
    >
        <span
            aria-hidden="true"
            className={`${
                checked ? 'translate-x-5' : 'translate-x-0'
            } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
        />
    </button>
);

const MessageItem = ({ msg }: { msg: OutreachMessage }) => (
    <div className="p-6 border-b border-border last:border-b-0">
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-surface-light rounded-full flex items-center justify-center text-text-primary border border-border flex-shrink-0">
                <BriefcaseIcon className="w-5 h-5" />
            </div>
            <div>
                <p className="font-semibold text-sm text-text-primary">{msg.recruiter_profile?.display_name || 'A Recruiter'}</p>
                <p className="text-xs text-text-secondary">{new Date(msg.created_at).toLocaleDateString()}</p>
            </div>
        </div>
        <p className="mt-3 text-text-secondary">{msg.message}</p>
        <a href={`mailto:${msg.recruiter_profile?.id.replace('mock-recruiter-1', 'recruiter@acme.com')}`} className="inline-block mt-3 px-4 py-1.5 text-sm font-semibold bg-accent-primary text-white rounded-md hover:bg-accent-primary-dark transition-colors">
            Reply via Email
        </a>
    </div>
);

export default function SettingsPage({ user, profile, onProfileUpdate }: SettingsPageProps) {
    const [fullName, setFullName] = useState(profile.full_name || '');
    const [isOpenToWork, setIsOpenToWork] = useState(profile.is_open_to_work);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'profile' | 'inbox'>('profile');
    const [outreachMessages, setOutreachMessages] = useState<OutreachMessage[]>([]);
    
    useEffect(() => {
        setFullName(profile.full_name || '');
        setIsOpenToWork(profile.is_open_to_work);
    }, [profile]);

    useEffect(() => {
        if (activeTab === 'inbox') {
            const fetchMessages = async () => {
                const { data, error } = await supabase.from('outreach_messages').select('*, recruiter_profile:profiles!outreach_messages_recruiter_id_fkey(*)').eq('developer_id', user.id);
                if (error) console.error("Error fetching messages:", error);
                else setOutreachMessages(data as any);
            };
            fetchMessages();
        }
    }, [activeTab, user.id]);

    const handleSave = async () => {
        setLoading(true);
        const updates = { full_name: fullName, is_open_to_work: isOpenToWork };

        try {
            const { error } = await supabase
                .from('profiles')
                .update(updates)
                .eq('id', user.id);

            if (error) throw error;

            onProfileUpdate();
            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Failed to update profile:", error);
            alert("Failed to update profile.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div className="border-b border-border mb-6">
                <nav className="-mb-px flex gap-6" aria-label="Tabs">
                    <button onClick={() => setActiveTab('profile')} className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'profile' ? 'border-accent-primary text-accent-primary' : 'border-transparent text-text-secondary hover:text-text-primary hover:border-border'}`}>
                        Profile & Opportunities
                    </button>
                    <button onClick={() => setActiveTab('inbox')} className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'inbox' ? 'border-accent-primary text-accent-primary' : 'border-transparent text-text-secondary hover:text-text-primary hover:border-border'}`}>
                        Recruiter Inbox <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-accent-primary text-white">{outreachMessages.length}</span>
                    </button>
                </nav>
            </div>

            {activeTab === 'profile' && (
                <div className="space-y-8 animate-fade-in">
                    <SettingsCard title="Profile">
                        <div className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-surface-light rounded-full flex items-center justify-center text-text-primary border border-border">
                                    <UserIcon className="w-8 h-8" />
                                </div>
                                <div>
                                    <p className="font-semibold text-text-primary">{user.email}</p>
                                    <p className="text-sm text-text-secondary">User since {new Date(user.created_at).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="mt-6">
                                <label htmlFor="full-name" className="block text-sm font-medium text-text-secondary mb-1">Display Name</label>
                                <input type="text" id="full-name" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your Name" className="w-full max-w-sm p-2 bg-surface-light rounded-lg border border-border focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/50 transition-colors placeholder-text-secondary text-text-primary" />
                            </div>
                        </div>
                    </SettingsCard>

                    <SettingsCard title="Opportunities">
                         <div className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-semibold text-text-primary">Open to Opportunities</p>
                                    <p className="text-sm text-text-secondary max-w-md mt-1">Enable this to let recruiters and companies know you're open to new career opportunities. Your profile may be featured in the Talent Spotlight.</p>
                                </div>
                                <Toggle checked={isOpenToWork} onChange={setIsOpenToWork} />
                            </div>
                        </div>
                    </SettingsCard>
                    <div className="flex justify-end">
                        <button onClick={handleSave} disabled={loading} className="px-6 py-2 bg-gradient-to-r from-accent-primary to-accent-primary-dark text-white font-bold rounded-lg shadow-lg hover:opacity-90 transition-opacity disabled:opacity-50">
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            )}

            {activeTab === 'inbox' && (
                 <div className="animate-fade-in">
                    <SettingsCard title="Recruiter Messages" noPadding>
                        {outreachMessages.length > 0 ? (
                            <div>
                                {outreachMessages.map(msg => <MessageItem key={msg.id} msg={msg} />)}
                            </div>
                        ) : (
                            <div className="p-10 text-center">
                                <p className="text-text-secondary">Your inbox is empty.</p>
                                <p className="text-sm text-text-secondary mt-1">When recruiters contact you, their messages will appear here.</p>
                            </div>
                        )}
                    </SettingsCard>
                 </div>
            )}
        </div>
    );
}
