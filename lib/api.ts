
import { supabase } from './supabaseClient';
import { LogEntry, Profile } from '../types';

export const api = {
  searchDevelopers: async (query: string, minReputation: number): Promise<Profile[]> => {
    const { data, error } = await supabase.functions.invoke('search-developers', {
      body: { query, minReputation },
    });
    if (error) throw error;
    return data.searchResults || [];
  },

  generateSynthesisReport: async (logs: LogEntry[]): Promise<string> => {
    const { data, error } = await supabase.functions.invoke('generate-synthesis-report', {
      body: { logs },
    });
    if (error) throw error;
    return data.report;
  },
  
  getChatbotResponse: async (history: any[], message: string): Promise<string> => {
    const { data, error } = await supabase.functions.invoke('get-chatbot-response', {
        body: { history, message },
    });
    if (error) throw error;
    return data.response;
  },

  upvoteItem: async (itemId: string, itemType: 'log' | 'comment', authorId: string): Promise<any> => {
     const { data, error } = await supabase.functions.invoke('upvote-item', {
        body: { item_id: itemId, item_type: itemType, author_id: authorId },
    });
    if (error) throw error;
    return data;
  },

  updateProfile: async (updates: { full_name: string; is_open_to_work: boolean }): Promise<Profile> => {
    // First try to update existing profile
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .select()
      .single();

    // If no profile exists, create one
    if (error && error.code === 'PGRST116') {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert([{
          id: user.user.id,
          full_name: updates.full_name,
          display_name: user.user.email?.split('@')[0] || 'Anonymous',
          reputation: 0,
          is_open_to_work: updates.is_open_to_work,
          role: 'developer'
        }])
        .select()
        .single();

      if (createError) throw createError;
      return newProfile;
    }

    if (error) throw error;
    return data;
  }
};
