
import React, { useState, useRef, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { User, Profile } from '../types';
import { UserIcon, LogoutIcon, StarIcon } from './icons';

interface HeaderProps {
  user: User;
  profile: Profile;
  pageTitle: string;
}

export default function Header({ user, profile, pageTitle }: HeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="flex-shrink-0 bg-surface/80 backdrop-blur-sm h-20 flex items-center justify-between px-6 sm:px-8 border-b border-border sticky top-0 z-20">
      <h1 className="text-2xl font-bold text-text-primary">{pageTitle}</h1>
      <div className="relative" ref={dropdownRef}>
        <button onClick={() => setDropdownOpen(!dropdownOpen)} className="w-10 h-10 bg-surface-light rounded-full flex items-center justify-center text-text-primary hover:ring-2 hover:ring-accent-primary transition-all">
          <UserIcon />
        </button>
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-surface rounded-lg shadow-xl z-30 border border-border animate-fade-in">
            <a href={`#/profile/${user.id}`} className="block px-4 py-3 border-b border-border hover:bg-surface-light transition-colors">
              <p className="text-sm font-medium text-text-primary truncate">{profile.display_name}</p>
              <div className="mt-1 flex items-center gap-1.5 text-xs text-text-secondary">
                <StarIcon className="w-3 h-3 text-accent-primary" />
                <span>{profile.reputation} Reputation</span>
              </div>
            </a>
            <div className="py-1">
              <a href="#settings" className="flex items-center gap-3 px-4 py-2 text-sm text-text-secondary hover:bg-surface-light hover:text-text-primary w-full text-left transition-colors">
                <span>Settings</span>
              </a>
              <a href="#" onClick={handleSignOut} className="flex items-center gap-3 px-4 py-2 text-sm text-text-secondary hover:bg-surface-light hover:text-text-primary w-full text-left transition-colors">
                <LogoutIcon />
                <span>Sign Out</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
