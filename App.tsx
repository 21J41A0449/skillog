
import React, { useState, useEffect, useCallback } from 'react';
import { LogEntry, Profile } from './types';
import { supabase } from './lib/supabaseClient';
import { Session, User } from '@supabase/supabase-js';
import MainLayout from './components/layout/MainLayout';
import RecruiterLayout from './components/layout/RecruiterLayout';
import Auth from './components/Auth';
import AuthRecruiter from './components/AuthRecruiter';
import { useRouter } from './hooks/useRouter';
import FloatingActionButton from './components/FloatingActionButton';
import Chatbot from './components/Chatbot';
import ConnectModal from './components/ConnectModal';
import { api } from './lib/api';

// Page Components
import DashboardPage from './pages/DashboardPage';
import SettingsPage from './pages/SettingsPage';
import ReportPage from './pages/ReportPage';
import FeedPage from './pages/FeedPage';
import LogDetailPage from './pages/LogDetailPage';
import CirclePage from './pages/CirclePage';
import CirclesDirectoryPage from './pages/CirclesDirectoryPage';
import TalentSpotlightPage from './pages/TalentSpotlightPage';
import TalentSearchPage from './pages/TalentSearchPage';
import RecruitersPage from './pages/RecruitersPage';
import ProfilePage from './pages/ProfilePage';

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [publicLogs, setPublicLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [upvotedItems, setUpvotedItems] = useState(new Set<string>());
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [connectProfile, setConnectProfile] = useState<Profile | null>(null);

  const { route, params } = useRouter();

  const fetchInitialData = useCallback(async (currentUser: User) => {
    try {
        // Try to fetch existing profile
        let { data: profileData, error: profileError } = await supabase.from('profiles').select('*').eq('id', currentUser.id).single();
        const role = currentUser.user_metadata?.role === 'recruiter' ? 'recruiter' : 'developer';
        if (profileError && profileError.code === 'PGRST116') {
            const { data: newProfile, error: createError } = await supabase
                .from('profiles')
                .insert([{
                    id: currentUser.id,
                    full_name: currentUser.user_metadata?.full_name || null,
                    display_name: currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || 'Anonymous',
                    reputation: 0,
                    is_open_to_work: false,
                    role
                }])
                .select()
                .single();

            if (createError) throw createError;
            profileData = newProfile;
        } else if (profileError) {
            throw profileError;
        } else if (profileData && profileData.role !== role && profileData.role !== 'recruiter') {
            const { data: updatedProfile } = await supabase
                .from('profiles')
                .update({ role })
                .eq('id', currentUser.id)
                .select()
                .single();
            if (updatedProfile) {
                profileData = updatedProfile;
            }
        }

        setProfile(profileData);

        const { data: publicData, error: publicError } = await supabase
            .from('learning_logs')
            .select('*, profiles!inner(id, full_name, avatar_url, reputation, is_open_to_work, role)')
            .eq('is_public', true)
            .order('created_at', { ascending: false });
        if (publicError) throw publicError;
        setPublicLogs(publicData as any);

        const { data: userData, error: userError } = await supabase
            .from('learning_logs')
            .select('*, profiles!inner(id, full_name, avatar_url, reputation, is_open_to_work, role)')
            .eq('user_id', currentUser.id)
            .order('created_at', { ascending: false });
        if (userError) throw userError;
        setLogs(userData as any);

    } catch (error) {
      console.error('Error fetching initial data:', error);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        await fetchInitialData(currentUser);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    supabase.auth.getSession().then(async ({ data: { session } }) => {
        if (session) {
            setSession(session);
            setUser(session.user);
            await fetchInitialData(session.user);
        }
        setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [fetchInitialData]);

  const handleAddLog = useCallback(async (newLog: Omit<LogEntry, 'id' | 'user_id' | 'created_at' | 'upvotes'>) => {
    if (!user || !profile) return;
    
    const { error } = await supabase.from('learning_logs').insert([{ ...newLog, user_id: user.id }]).select().single();
    
    if (error) {
        console.error('Error adding log:', error);
        alert('Error: Could not post your log.');
    } else {
        await fetchInitialData(user);
    }
  }, [user, profile, fetchInitialData]);

  const handleUpvote = async (itemId: string, itemType: 'log' | 'comment', authorId: string) => {
      const isCurrentlyUpvoted = upvotedItems.has(itemId);
      setUpvotedItems(prev => {
          const newSet = new Set(prev);
          isCurrentlyUpvoted ? newSet.delete(itemId) : newSet.add(itemId);
          return newSet;
      });

      try {
        await api.upvoteItem(itemId, itemType, authorId);
      } catch (error) {
        console.error('Failed to upvote:', error);
        setUpvotedItems(prev => {
            const newSet = new Set(prev);
            isCurrentlyUpvoted ? newSet.add(itemId) : newSet.delete(itemId);
            return newSet;
        });
      }
  };

  const handleProfileUpdate = async () => {
      if (user) {
          await fetchInitialData(user);
      }
  };

  const renderDeveloperPages = () => {
    switch (route) {
      case 'feed':
        return <FeedPage logs={publicLogs} upvotedItems={upvotedItems} onUpvote={handleUpvote} />;
      case 'log':
        return <LogDetailPage logId={params.id} currentUser={user!} upvotedItems={upvotedItems} onUpvote={handleUpvote} />;
      case 'circles':
        return <CirclesDirectoryPage />;
      case 'circle':
        return <CirclePage circleId={params.id} currentUser={user!} publicLogs={publicLogs} />;
      case 'recruiters':
        return <RecruitersPage />;
      case 'settings':
        return <SettingsPage user={user!} profile={profile!} onProfileUpdate={handleProfileUpdate} />;
      case 'report':
        return <ReportPage logs={logs} user={user!} />;
      case 'profile':
        return <ProfilePage profileId={params.id || user!.id} currentUser={user!} />;
      case 'dashboard':
      default:
        return <DashboardPage logs={logs} onAddLog={handleAddLog} />;
    }
  };

  const renderRecruiterPages = () => {
     switch (route) {
      case 'spotlight':
        return <TalentSpotlightPage onConnect={setConnectProfile} />;
      case 'profile':
        return <ProfilePage profileId={params.id} currentUser={user!} onConnect={setConnectProfile} />;
      case 'search':
      default:
        return <TalentSearchPage onConnect={setConnectProfile} />;
    }
  }

  if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-accent-primary"></div>
        </div>
      );
  }

  if (!session || !user || !profile) {
    if (route === 'auth-recruiter') {
        return <AuthRecruiter />;
    }
    return <Auth />;
  }

  if (profile.role === 'recruiter') {
      return (
        <>
            <RecruiterLayout user={user} profile={profile} route={route}>
                {renderRecruiterPages()}
            </RecruiterLayout>
            {connectProfile && <ConnectModal profile={connectProfile} onClose={() => setConnectProfile(null)} />}
        </>
      );
  }

  return (
    <>
      <MainLayout user={user} profile={profile} route={route}>
        {renderDeveloperPages()}
      </MainLayout>
      
      <FloatingActionButton onClick={() => setIsChatbotOpen(true)} />
      {isChatbotOpen && <Chatbot onClose={() => setIsChatbotOpen(false)} />}
    </>
  );
}
