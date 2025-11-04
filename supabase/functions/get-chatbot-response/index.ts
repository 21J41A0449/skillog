
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { GoogleGenAI, Chat } from 'npm:@google/genai';
import { corsHeaders } from '../_shared/cors.ts';

const systemInstruction = {
    role: 'user',
    parts: [{ text: "You are a friendly and expert learning assistant for the Daily Skill Log app. You help users understand programming concepts, debug code, and suggest learning resources. Keep your answers concise, well-formatted with Markdown, and encouraging." }],
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { history, message } = await req.json();
    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error("Missing GEMINI_API_KEY");
    }
    const ai = new GoogleGenAI({ apiKey, vertexai: true });

    const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        history: [systemInstruction, ...history],
    });

    const result = await chat.sendMessage(message);
    const response = result.text;

    return new Response(JSON.stringify({ response }), {
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
