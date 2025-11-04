
import React, { useState } from 'react';
import { User, Profile } from '../../types';
import { SearchIcon, SpotlightIcon, CollapseIcon, ExpandIcon, BriefcaseIcon } from '../icons';
import Header from '../Header';

interface RecruiterLayoutProps {
  user: User;
  profile: Profile;
  route: string;
  children: React.ReactNode;
}

const navItems = [
  { name: 'Talent Search', icon: SearchIcon, href: '#search', id: 'search' },
  { name: 'Spotlight', icon: SpotlightIcon, href: '#spotlight', id: 'spotlight' },
];

const getPageTitle = (route: string) => {
    switch (route) {
        case 'spotlight': return 'Talent Spotlight';
        case 'search':
        default: return 'Talent Search';
    }
}

export default function RecruiterLayout({ user, profile, route, children }: RecruiterLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-background text-text-primary">
      <aside 
        className={`fixed top-0 left-0 h-full bg-surface border-r border-border flex flex-col transition-all duration-300 ease-in-out z-30`}
        style={{ width: isSidebarCollapsed ? '80px' : '256px' }}
      >
        <div className="flex items-center h-20 border-b border-border px-6 flex-shrink-0">
          <BriefcaseIcon className="w-7 h-7 text-accent-primary" />
          {!isSidebarCollapsed && <span className="ml-3 text-xl font-bold">Recruiter</span>}
        </div>
        <div className="flex-grow flex flex-col justify-between overflow-y-auto">
          <nav className="flex-1 py-6 px-4 space-y-2">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`flex items-center p-3 rounded-lg transition-colors ${
                  (route === item.id || (route !== 'spotlight' && item.id === 'search'))
                    ? 'bg-surface-light text-text-primary' 
                    : 'text-text-secondary hover:bg-surface-light hover:text-text-primary'
                }`}
                title={item.name}
              >
                <item.icon />
                {!isSidebarCollapsed && <span className="ml-4 font-medium">{item.name}</span>}
              </a>
            ))}
          </nav>
          <div className="px-4 py-4 border-t border-border">
              <button 
                  onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                  className="flex items-center w-full p-3 rounded-lg text-text-secondary hover:bg-surface-light hover:text-text-primary transition-colors"
                  title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
              >
                  {isSidebarCollapsed ? <ExpandIcon /> : <CollapseIcon />}
                  {!isSidebarCollapsed && <span className="ml-4 font-medium">Collapse</span>}
              </button>
          </div>
        </div>
      </aside>
      <div 
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out`}
        style={{ marginLeft: isSidebarCollapsed ? '80px' : '256px' }}
      >
        <Header user={user} profile={profile} pageTitle={getPageTitle(route)} />
        <main className="flex-grow p-6 sm:p-8">
          <div className="w-full max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
