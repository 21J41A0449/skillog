
import React from 'react';
import { DashboardIcon, SettingsIcon, CollapseIcon, ExpandIcon, LogoIcon, DocumentTextIcon, FeedIcon, CirclesIcon, BriefcaseIcon } from '../icons';

interface NavigationSidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (isCollapsed: boolean) => void;
  activeRoute: string;
}

const navItems = [
  { name: 'Feed', icon: FeedIcon, href: '#feed', id: 'feed' },
  { name: 'Circles', icon: CirclesIcon, href: '#circles', id: 'circles' },
  { name: 'My Dashboard', icon: DashboardIcon, href: '#dashboard', id: 'dashboard' },
  { name: 'My Report', icon: DocumentTextIcon, href: '#report', id: 'report' },
];

const bottomNavItems = [
    { name: 'Settings', icon: SettingsIcon, href: '#settings', id: 'settings' },
    { name: 'For Recruiters', icon: BriefcaseIcon, href: '#recruiters', id: 'recruiters' },
]

export default function NavigationSidebar({ isCollapsed, setIsCollapsed, activeRoute }: NavigationSidebarProps) {
  return (
    <aside 
      className={`fixed top-0 left-0 h-full bg-surface border-r border-border flex flex-col transition-all duration-300 ease-in-out z-30`}
      style={{ width: isCollapsed ? '80px' : '256px' }}
    >
      <div className="flex items-center h-20 border-b border-border px-6 flex-shrink-0">
        <LogoIcon />
        {!isCollapsed && <span className="ml-3 text-xl font-bold text-text-primary">Skill Log</span>}
      </div>
      <div className="flex-grow flex flex-col justify-between overflow-y-auto">
        <nav className="flex-1 py-6 px-4 space-y-2">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className={`flex items-center p-3 rounded-lg transition-colors ${
                activeRoute === item.id 
                  ? 'bg-surface-light text-text-primary' 
                  : 'text-text-secondary hover:bg-surface-light hover:text-text-primary'
              }`}
              title={item.name}
            >
              <item.icon />
              {!isCollapsed && <span className="ml-4 font-medium">{item.name}</span>}
            </a>
          ))}
        </nav>
        <div className="px-4 py-4 border-t border-border">
            {bottomNavItems.map((item) => (
                 <a
                    key={item.name}
                    href={item.href}
                    className={`flex items-center p-3 rounded-lg transition-colors mb-2 ${
                        activeRoute === item.id 
                        ? 'bg-surface-light text-text-primary' 
                        : 'text-text-secondary hover:bg-surface-light hover:text-text-primary'
                    }`}
                    title={item.name}
                >
                    <item.icon />
                    {!isCollapsed && <span className="ml-4 font-medium">{item.name}</span>}
                </a>
            ))}
            <button 
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="flex items-center w-full p-3 rounded-lg text-text-secondary hover:bg-surface-light hover:text-text-primary transition-colors"
                title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
                {isCollapsed ? <ExpandIcon /> : <CollapseIcon />}
                {!isCollapsed && <span className="ml-4 font-medium">Collapse</span>}
            </button>
        </div>
      </div>
    </aside>
  );
}
