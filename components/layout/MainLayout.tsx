
import React, { useState } from 'react';
import { User, Profile } from '../../types';
import NavigationSidebar from './NavigationSidebar';
import Header from '../Header';

interface MainLayoutProps {
  user: User;
  profile: Profile;
  route: string;
  children: React.ReactNode;
}

const getPageTitle = (route: string) => {
    switch (route) {
        case 'feed': return 'Community Feed';
        case 'log': return 'Log Details';
        case 'circles': return 'Study Circles';
        case 'circle': return 'Study Circle';
        case 'spotlight': return 'Talent Spotlight';
        case 'search': return 'Talent Search';
        case 'recruiters': return 'For Recruiters';
        case 'settings': return 'Settings';
        case 'report': return 'My Report';
        case 'profile': return 'Developer Profile';
        default: return 'My Dashboard';
    }
}

export default function MainLayout({ user, profile, route, children }: MainLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-background text-text-primary">
      <NavigationSidebar 
        isCollapsed={isSidebarCollapsed} 
        setIsCollapsed={setIsSidebarCollapsed} 
        activeRoute={route}
      />
      <div 
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out`}
        style={{ marginLeft: isSidebarCollapsed ? '80px' : '256px' }}
      >
        <Header user={user} profile={profile} pageTitle={getPageTitle(route)} />
        <main className="flex-grow p-6 sm:p-8">
          <div className="w-full max-w-4xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
