
import React from 'react';
import { BriefcaseIcon, SearchIcon, SpotlightIcon } from '../components/icons';

const FeatureCard = ({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode }) => (
    <div className="bg-surface p-6 rounded-xl border border-border">
        <div className="flex items-center gap-3">
            {icon}
            <h3 className="font-bold text-text-primary">{title}</h3>
        </div>
        <p className="mt-2 text-sm text-text-secondary">{children}</p>
    </div>
);

export default function RecruitersPage() {
    return (
        <div className="animate-fade-in">
            <div className="text-center max-w-3xl mx-auto">
                <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-4 border border-border">
                    <BriefcaseIcon className="w-8 h-8 text-accent-primary" />
                </div>
                <h1 className="text-4xl sm:text-5xl font-bold text-text-primary">The Highest-Signal Talent Pool in Tech</h1>
                <p className="mt-4 text-lg text-text-secondary">
                    Stop relying on outdated resumes and embellished profiles. Access a live, verifiable stream of developer skills, passion, and proof-of-work.
                </p>
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
                <FeatureCard icon={<SearchIcon className="text-accent-secondary" />} title="AI-Powered Semantic Search">
                    Find candidates based on the skills they actually use, not just the keywords on their profile. Search for "backend databases" and find top talent working with PostgreSQL, MongoDB, and Supabase.
                </FeatureCard>
                 <FeatureCard icon={<SpotlightIcon className="text-accent-secondary" />} title="Verifiable Proof-of-Work">
                    See a developer's day-to-day activity, problem-solving process, and community contributions. Our Reputation Score helps you instantly identify top-tier talent.
                </FeatureCard>
            </div>

            <div className="mt-12 bg-surface border border-border rounded-2xl p-8">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-text-primary">See The Quality For Yourself</h2>
                    <p className="mt-2 text-text-secondary">The Talent Spotlight is a weekly, AI-curated showcase of our top developers.</p>
                    <a href="#spotlight" className="mt-4 inline-block text-accent-primary font-semibold hover:underline">
                        View This Week's Talent Spotlight &rarr;
                    </a>
                </div>
            </div>

            <div className="mt-12 text-center">
                 <h2 className="text-3xl font-bold text-text-primary">Ready to Stop Guessing?</h2>
                 <p className="mt-2 text-text-secondary">Get access to our full talent database and start finding the right developers today.</p>
                 <a href="mailto:sales@skilllog.com" className="mt-6 inline-block w-full max-w-xs py-3 bg-gradient-to-r from-accent-primary to-accent-primary-dark text-white font-bold rounded-lg shadow-lg hover:opacity-90 transition-opacity">
                    Request Early Access
                </a>
            </div>
        </div>
    );
}
