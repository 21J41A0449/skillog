
import React, { useState, useEffect } from 'react';
import { Profile } from '../types';
import { UserIcon, StarIcon, SpotlightIcon } from '../components/icons';
import { supabase } from '../lib/supabaseClient';

interface TalentSpotlightPageProps {
    onConnect: (profile: Profile) => void;
}

const DeveloperCard = ({ profile, onConnect }: { profile: Profile, onConnect: (profile: Profile) => void }) => (
    <div className="bg-surface p-6 rounded-xl border border-border hover:border-accent-primary/50 transition-colors group">
        <div className="flex items-center gap-4">
            <a href={`#/profile/${profile.id}`} className="w-12 h-12 bg-surface-light rounded-full flex items-center justify-center text-text-primary border border-border flex-shrink-0">
                <UserIcon className="w-7 h-7" />
            </a>
            <div>
                <a href={`#/profile/${profile.id}`} className="font-bold text-text-primary hover:underline">{profile.display_name}</a>
                <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                    <StarIcon className="w-3 h-3 text-accent-primary" />
                    <span>{profile.reputation} Reputation</span>
                </div>
            </div>
        </div>
        <p className="mt-4 text-sm text-text-secondary">{profile.spotlight_summary}</p>
        <div className="mt-4 pt-4 border-t border-border">
             <button onClick={() => onConnect(profile)} className="w-full py-2 text-sm font-semibold bg-surface-light text-text-primary rounded-lg border border-border hover:bg-accent-primary hover:text-white hover:border-accent-primary transition-colors">
                Connect
            </button>
        </div>
    </div>
);

export default function TalentSpotlightPage({ onConnect }: TalentSpotlightPageProps) {
    const [spotlightedProfiles, setSpotlightedProfiles] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSpotlight = async () => {
            setLoading(true);
            try {
                // In a real app, this might call an Edge Function that does more complex ranking
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('is_open_to_work', true)
                    .not('spotlight_summary', 'is', null)
                    .order('reputation', { ascending: false })
                    .limit(10);
                
                if (error) throw error;
                setSpotlightedProfiles(data);
            } catch (error) {
                console.error("Error fetching talent spotlight:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSpotlight();
    }, []);

    return (
        <div className="animate-fade-in">
            <div className="bg-surface border border-border rounded-2xl p-8 mb-8">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-surface-light rounded-full flex items-center justify-center border border-border">
                        <SpotlightIcon className="w-6 h-6 text-accent-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-bold text-text-primary">Talent Spotlight</h1>
                        <p className="mt-1 text-text-secondary max-w-2xl">A weekly, AI-curated showcase of the most active and helpful developers in our community who are open to new opportunities.</p>
                    </div>
                </div>
            </div>
            {loading ? (
                <p className="text-center text-text-secondary">Loading spotlight...</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {spotlightedProfiles.map(profile => (
                        <DeveloperCard key={profile.id} profile={profile} onConnect={onConnect} />
                    ))}
                    {spotlightedProfiles.length === 0 && (
                        <div className="md:col-span-2 text-center py-10 px-6 bg-surface rounded-xl border border-border">
                            <p className="text-text-secondary">The spotlight is being prepared. Check back next week for the latest featured developers!</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
