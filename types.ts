
import { User } from '@supabase/supabase-js';

export type Mood = '😄' | '😐' | '😫';
export type UserRole = 'developer' | 'recruiter';

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  display_name: string; 
  reputation: number;
  is_open_to_work: boolean;
  spotlight_summary?: string | null;
  role: UserRole;
}

export interface LogEntry {
  id: string;
  user_id: string;
  created_at: string;
  text: string;
  tags: string[];
  mood: Mood;
  image_url?: string | null;
  is_public: boolean;
  upvotes: number;
  github_url?: string | null;
  live_url?: string | null;
  // Enriched data
  profiles?: Profile;
  comment_count?: number;
}

export interface Comment {
    id: string;
    log_id: string;
    user_id: string;
    content: string;
    created_at: string;
    upvotes: number;
    // Enriched data
    profiles?: Profile;
}

export interface Circle {
    id: string;
    name: string;
    description: string;
    created_by: string;
    is_private: boolean;
}

export interface CircleMessage {
    id: string;
    circle_id: string;
    user_id: string;
    content: string;
    created_at: string;
    // Enriched data
    profiles?: Profile;
}

export interface ChatHistoryMessage {
    role: 'user' | 'model';
    parts: { text: string }[];
}

export interface OutreachMessage {
    id: string;
    developer_id: string;
    recruiter_id: string;
    message: string;
    created_at: string;
    // Enriched data
    recruiter_profile?: Profile;
}
