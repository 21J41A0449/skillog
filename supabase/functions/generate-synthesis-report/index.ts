
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { GoogleGenAI } from 'npm:@google/genai';
import { corsHeaders } from '../_shared/cors.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { logs } = await req.json();
    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error("Missing GEMINI_API_KEY");
    }
    const ai = new GoogleGenAI({ apiKey, vertexai: true });

    const logsText = logs.map(log => `Date: ${new Date(log.created_at).toLocaleDateString()}\nTags: ${log.tags.join(', ')}\nLog: ${log.text}\nGitHub: ${log.github_url || 'N/A'}\nLive URL: ${log.live_url || 'N/A'}`).join('\n\n---\n\n');
    const prompt = `You are an expert career coach and technical writer, specializing in summarizing a developer's learning journey for recruiters and hiring managers. Analyze the following learning logs and generate a concise, professional "Proof of Skill" report in Markdown format.

The report MUST include the following sections:
1.  **Executive Summary:** A 2-3 sentence overview of the user's recent learning trajectory and key areas of focus.
2.  **Core Competencies:** Analyze the tags and log content to identify and cluster 3-4 high-level skills (e.g., "React & State Management," "Backend Integration," "CSS Architecture"). List them as bullet points.
3.  **Key Project Milestones:** Identify 2-3 log entries that represent significant accomplishments or project-based work. Pay special attention to logs that include a GitHub or Live URL, as these represent tangible projects. Quote or summarize them as evidence of practical application.
4.  **Learning Velocity:** Provide a simple metric based on the number of logs, like "Logged ${logs.length} sessions, demonstrating a consistent commitment to skill development."

Here are the logs:

${logsText}`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { role: 'user', parts: [{ text: prompt }] },
    });

    return new Response(JSON.stringify({ report: response.text }), {
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
