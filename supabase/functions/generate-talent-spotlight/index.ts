
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { GoogleGenAI } from 'npm:@google/genai';
import { corsHeaders } from '../_shared/cors.ts';

// In a real app, this would fetch data from Supabase
// For now, we'll use a placeholder.
const getTopDevelopers = () => {
    return [
        {
            id: 'mock-user-2',
            display_name: 'Jane Doe',
            reputation: 850,
            logs: [
                { text: 'Trying to understand how to properly type a higher-order component in TypeScript. The generics are a bit confusing.', tags: ['typescript', 'react', 'hoc'] },
                { text: 'Refactored our state management to use Zustand. It\'s so much simpler than Redux for this project.', tags: ['react', 'zustand', 'state-management'] },
            ],
            comments: [
                { content: 'Congrats! That first deployment feeling is the best. Did you set up a custom domain?' }
            ]
        }
    ];
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error("Missing GEMINI_API_KEY");
    }
    const ai = new GoogleGenAI({ apiKey, vertexai: true });

    const topDevelopers = getTopDevelopers();
    const spotlightedProfiles = [];

    for (const dev of topDevelopers) {
        const prompt = `You are a talent scout for a top tech company. Analyze the following developer's activity and write a short, compelling "Spotlight Summary" (max 30 words) for why they are a developer to watch. Focus on their skills, consistency, and community involvement.

Developer Name: ${dev.display_name}
Reputation: ${dev.reputation}
Recent Logs:
${dev.logs.map(l => `- ${l.text} (Tags: ${l.tags.join(', ')})`).join('\n')}

Recent Comments:
${dev.comments.map(c => `- ${c.content}`).join('\n')}

Spotlight Summary:`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { role: 'user', parts: [{ text: prompt }] },
        });

        spotlightedProfiles.push({
            ...dev,
            spotlight_summary: response.text,
        });
    }

    return new Response(JSON.stringify({ spotlightedProfiles }), {
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
