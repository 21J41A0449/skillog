
import React, { useState } from 'react';
import { Profile } from '../types';
import { UserIcon, StarIcon, SearchIcon } from '../components/icons';
import { api } from '../lib/api';

interface TalentSearchPageProps {
    onConnect: (profile: Profile) => void;
}

const DeveloperCard = ({ profile, reason, onConnect }: { profile: Profile & { match_reason?: string }, reason?: string, onConnect: (profile: Profile) => void }) => (
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
        {reason && (
            <p className="mt-4 text-sm text-text-secondary italic">
                <span className="font-semibold text-text-primary">Match reason:</span> {reason}
            </p>
        )}
        <div className="mt-4 pt-4 border-t border-border">
             <button onClick={() => onConnect(profile)} className="w-full py-2 text-sm font-semibold bg-surface-light text-text-primary rounded-lg border border-border hover:bg-accent-primary hover:text-white hover:border-accent-primary transition-colors">
                Connect
            </button>
        </div>
    </div>
);

export default function TalentSearchPage({ onConnect }: TalentSearchPageProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [minReputation, setMinReputation] = useState(0);
    const [searchResults, setSearchResults] = useState<Profile[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setHasSearched(true);
        setSearchResults([]);

        try {
            const results = await api.searchDevelopers(searchQuery, minReputation);
            setSearchResults(results);
        } catch (error) {
            console.error("Error searching developers:", error);
            setSearchResults([]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="animate-fade-in">
            <div className="bg-surface border border-border rounded-2xl p-8 mb-8">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-surface-light rounded-full flex items-center justify-center border border-border">
                        <SearchIcon className="w-6 h-6 text-accent-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-bold text-text-primary">Talent Search</h1>
                        <p className="mt-1 text-text-secondary max-w-2xl">Find the perfect developer for your team using our AI-powered semantic search and reputation filtering.</p>
                    </div>
                </div>
                <form onSubmit={handleSearch} className="mt-6 flex flex-col md:flex-row gap-4">
                    <input 
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search skills, e.g., 'React state management'"
                        className="flex-grow p-3 bg-surface-light rounded-lg border border-border focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/50 transition-colors placeholder-text-secondary text-text-primary"
                    />
                    <div className="flex items-center gap-2">
                        <label htmlFor="reputation" className="text-sm font-medium text-text-secondary">Reputation &gt;</label>
                        <input 
                            type="number"
                            id="reputation"
                            value={minReputation}
                            onChange={(e) => setMinReputation(Number(e.target.value))}
                            className="w-24 p-3 bg-surface-light rounded-lg border border-border focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/50 transition-colors text-text-primary"
                        />
                    </div>
                    <button type="submit" disabled={isLoading} className="px-6 py-3 bg-gradient-to-r from-accent-primary to-accent-primary-dark text-white font-bold rounded-lg shadow-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2">
                        {isLoading ? <div className="w-5 h-5 border-2 border-dashed rounded-full animate-spin"></div> : <SearchIcon />}
                        <span>Search</span>
                    </button>
                </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {isLoading ? (
                    <p className="md:col-span-2 text-center text-text-secondary">Searching for talent...</p>
                ) : hasSearched && searchResults.length > 0 ? (
                    searchResults.map(profile => (
                        <DeveloperCard key={profile.id} profile={profile} reason={(profile as any).match_reason || "Strong experience in React and TypeScript, with high community reputation."} onConnect={onConnect} />
                    ))
                ) : hasSearched ? (
                    <div className="md:col-span-2 text-center py-10 px-6 bg-surface rounded-xl border border-border">
                        <p className="text-text-secondary">No results found. Try broadening your search criteria.</p>
                    </div>
                ) : null}
            </div>
        </div>
    );
}
