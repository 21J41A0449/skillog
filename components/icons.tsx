
import React from 'react';

export const SparkleIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 3L9.5 8.5L4 11L9.5 13.5L12 19L14.5 13.5L20 11L14.5 8.5L12 3Z" />
    <path d="M5 3L6 5" />
    <path d="M18 19L19 21" />
    <path d="M3 19L5 18" />
    <path d="M21 5L19 6" />
  </svg>
);

export const UserIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

export const LockIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

export const ChartBarIcon = ({ className = "w-6 h-6 text-accent-primary" }: { className?: string }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        className={className}
    >
        <path d="M3 3v18h18"></path>
        <path d="M9 17V9"></path>
        <path d="M15 17V5"></path>
        <path d="M12 17v-4"></path>
    </svg>
);

export const StarIcon = ({ className = "w-8 h-8 text-accent-primary" }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
    </svg>
);

export const LogoIcon = ({ size = "32" }: { size?: string }) => (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5.33301 25.3333V13.3333L15.9997 6.66666L26.6663 13.3333V25.3333" stroke="url(#paint0_linear_1_2)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M21.3337 25.3333V16C21.3337 14.8954 20.4382 14 19.3337 14H12.667C11.5624 14 10.667 14.8954 10.667 16V25.3333" stroke="url(#paint1_linear_1_2)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        <defs>
            <linearGradient id="paint0_linear_1_2" x1="16" y1="6.66666" x2="16" y2="25.3333" gradientUnits="userSpaceOnUse">
                <stop stopColor="#34D399"/>
                <stop offset="1" stopColor="#059669"/>
            </linearGradient>
            <linearGradient id="paint1_linear_1_2" x1="16.0003" y1="14" x2="16.0003" y2="25.3333" gradientUnits="userSpaceOnUse">
                <stop stopColor="#34D399"/>
                <stop offset="1" stopColor="#059669"/>
            </linearGradient>
        </defs>
    </svg>
);

const IconBase = ({ children, className = "w-6 h-6" }: { children: React.ReactNode, className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        {children}
    </svg>
);

export const DashboardIcon = () => <IconBase><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></IconBase>;
export const SettingsIcon = () => <IconBase><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></IconBase>;
export const CollapseIcon = () => <IconBase><path d="M9 18l6-6-6-6"></path></IconBase>;
export const ExpandIcon = () => <IconBase><path d="M15 18l-6-6 6-6"></path></IconBase>;
export const LogoutIcon = () => <IconBase><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></IconBase>;
export const DocumentTextIcon = ({ className = "w-6 h-6" }: { className?: string }) => <IconBase className={className}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></IconBase>;
export const FeedIcon = () => <IconBase><path d="M4 11a9 9 0 0 1 9 9"></path><path d="M4 4a16 16 0 0 1 16 16"></path><circle cx="5" cy="19" r="1"></circle></IconBase>;
export const CommentIcon = () => <IconBase className="w-5 h-5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></IconBase>;
export const UpvoteIcon = ({ className = "w-5 h-5" }: { className?: string }) => <IconBase className={className}><path d="M12 19V5M5 12l7-7 7 7"/></IconBase>;
export const GlobeIcon = ({ className = "w-5 h-5" }: { className?: string }) => <IconBase className={className}><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></IconBase>;
export const CirclesIcon = ({ className = "w-6 h-6" }: { className?: string }) => <IconBase className={className}><path d="M12 12m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"></path><path d="M12 3l0 2"></path><path d="M3 12l2 0"></path><path d="M12 21l0 -2"></path><path d="M21 12l-2 0"></path></IconBase>;
export const CloseIcon = ({ className = "w-6 h-6" }: { className?: string }) => <IconBase className={className}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></IconBase>;
export const SendIcon = () => <IconBase className="w-6 h-6"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></IconBase>;
export const ShareIcon = ({ className = "w-5 h-5" }: { className?: string }) => <IconBase className={className}><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></IconBase>;
export const SpotlightIcon = () => <IconBase><path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path><path d="M12 12m-6 0a6 6 0 1 0 12 0a6 6 0 1 0 -12 0"></path><path d="M12 3l0 2"></path><path d="M3 12l2 0"></path><path d="M12 21l0 -2"></path><path d="M21 12l-2 0"></path></IconBase>;
export const SearchIcon = () => <IconBase><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></IconBase>;
export const BriefcaseIcon = ({ className = "w-6 h-6", size }: { className?: string, size?: string }) => {
    const finalClassName = size ? `w-${size} h-${size}` : className;
    return <IconBase className={finalClassName}><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></IconBase>;
};
export const GitHubIcon = ({ className = "w-5 h-5" }: { className?: string }) => <IconBase className={className}><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></IconBase>;
export const ExternalLinkIcon = ({ className = "w-5 h-5" }: { className?: string }) => <IconBase className={className}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></IconBase>;
