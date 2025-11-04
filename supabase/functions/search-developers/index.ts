
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { GoogleGenAI } from 'npm:@google/genai';
import { corsHeaders } from '../_shared/cors.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

interface Profile {
    id: string;
    display_name: string;
    reputation: number;
    is_open_to_work: boolean;
    full_name: string;
    avatar_url: string;
    role: string;
}

const searchDevelopersInDB = async (query: string, minReputation: number) => {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch developers who are open to work and meet reputation criteria
    const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select(`
            id,
            display_name,
            reputation,
            is_open_to_work,
            full_name,
            avatar_url,
            role
        `)
        .eq('is_open_to_work', true)
        .eq('role', 'developer')
        .gte('reputation', minReputation);

    if (profileError) {
        console.error('Error fetching profiles:', profileError);
        return [];
    }

    // For each profile, fetch their recent logs
    const developersWithLogs = await Promise.all(
        profiles.map(async (profile) => {
            const { data: logs, error: logError } = await supabase
                .from('learning_logs')
                .select('text, tags, created_at')
                .eq('user_id', profile.id)
                .eq('is_public', true)
                .order('created_at', { ascending: false })
                .limit(10);

            if (logError) {
                console.error('Error fetching logs for user:', profile.id, logError);
                return { ...profile, logs: [] };
            }

            return { ...profile, logs: logs || [] };
        })
    );

    return developersWithLogs;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { query, minReputation } = await req.json();
    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error("Missing GEMINI_API_KEY");
    }
    const ai = new GoogleGenAI({ apiKey, vertexai: true });

    // 1. Fetch candidates from DB based on filters
    const candidates = await searchDevelopersInDB(query, minReputation);

    // 2. Use AI to perform semantic search and generate match reasons
    const searchResults = [];
    for (const dev of candidates) {
        const prompt = `You are a tech recruiter. A user is searching for a developer with skills in "${query}".
Analyze this developer's profile and recent logs to see if they are a good match.
Provide a one-sentence "Match Reason" explaining why they are relevant to the search. If they are not a good match, respond with "NO_MATCH".

Developer: ${dev.display_name}
Logs:
${dev.logs.map(l => `- ${l.text}`).join('\n')}

Match Reason:`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { role: 'user', parts: [{ text: prompt }] },
        });

        const reason = response.text.trim();
        if (reason !== 'NO_MATCH') {
            searchResults.push({
                ...dev,
                match_reason: reason,
            });
        }
    }

    return new Response(JSON.stringify({ searchResults }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
