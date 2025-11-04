
import React, { useState } from 'react';
import { Profile } from '../types';
import { SendIcon, CloseIcon, UserIcon } from './icons';

interface ConnectModalProps {
    profile: Profile;
    onClose: () => void;
}

export default function ConnectModal({ profile, onClose }: ConnectModalProps) {
    const [message, setMessage] = useState(`Hi ${profile.display_name.split(' ')[0]}, I was impressed by your profile and work on Skill Log. We're hiring for a role I think you'd be a great fit for. Would you be open to a quick chat?`);
    const [isSending, setIsSending] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSending(true);
        // In a real app, this would call the 'send-outreach-message' Edge Function
        console.log(`Sending message to ${profile.id}: ${message}`);
        setTimeout(() => {
            setIsSending(false);
            onClose();
            alert("Your message has been sent! The developer will reply via email if they are interested.");
        }, 1500);
    };

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
        >
            <div
                className="bg-surface rounded-2xl shadow-2xl w-full max-w-lg p-6 border border-border"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="flex items-center justify-between pb-4 border-b border-border">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-surface-light rounded-full flex items-center justify-center text-text-primary border border-border">
                            <UserIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-text-primary">Contact {profile.display_name}</h3>
                            <p className="text-sm text-text-secondary">Your message will be sent securely via Skill Log.</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-1 text-text-secondary hover:text-text-primary">
                        <CloseIcon />
                    </button>
                </header>
                <form onSubmit={handleSubmit} className="mt-4">
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={8}
                        className="w-full p-3 bg-surface-light rounded-lg border border-border focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/50 transition-colors placeholder-text-secondary text-text-primary"
                    />
                    <div className="mt-4 flex justify-end">
                        <button type="submit" disabled={isSending} className="px-6 py-2 bg-gradient-to-r from-accent-primary to-accent-primary-dark text-white font-semibold rounded-lg shadow-md hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2">
                            {isSending ? 'Sending...' : <><SendIcon className="w-5 h-5" /> Send Message</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
