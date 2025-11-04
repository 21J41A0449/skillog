
import React, { useState } from 'react';
import { LogEntry, Mood } from '../types';
import { GlobeIcon, LockIcon, GitHubIcon, ExternalLinkIcon } from './icons';

interface LogFormProps {
  onAddLog: (newLog: Omit<LogEntry, 'id' | 'user_id' | 'created_at' | 'upvotes'>) => Promise<void>;
}

const MOODS: Mood[] = ['😄', '😐', '😫'];

export default function LogForm({ onAddLog }: LogFormProps) {
  const [text, setText] = useState('');
  const [tags, setTags] = useState('');
  const [mood, setMood] = useState<Mood>('😄');
  const [isPublic, setIsPublic] = useState(true);
  const [githubUrl, setGithubUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setText('');
    setTags('');
    setMood('😄');
    setIsPublic(true);
    setGithubUrl('');
    setLiveUrl('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      alert('Please write what you learned!');
      return;
    }
    
    setLoading(true);

    await onAddLog({
      text,
      tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
      mood,
      is_public: isPublic,
      github_url: githubUrl,
      live_url: liveUrl,
    });
    
    setLoading(false);
    resetForm();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-surface p-6 rounded-xl border border-border space-y-4">
      <textarea
        id="log-text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="What did you learn or build today? Share it with the community..."
        className="w-full p-3 bg-surface-light rounded-lg border border-border focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/50 transition-colors placeholder-text-secondary text-text-primary"
        rows={4}
        required
        disabled={loading}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <GitHubIcon className="w-5 h-5 text-text-secondary" />
            </div>
            <input
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="GitHub URL"
                className="w-full p-3 pl-10 bg-surface-light rounded-lg border border-border focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/50 transition-colors placeholder-text-secondary text-text-primary"
                disabled={loading}
            />
        </div>
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <ExternalLinkIcon className="w-5 h-5 text-text-secondary" />
            </div>
            <input
                type="url"
                value={liveUrl}
                onChange={(e) => setLiveUrl(e.target.value)}
                placeholder="Live Demo URL"
                className="w-full p-3 pl-10 bg-surface-light rounded-lg border border-border focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/50 transition-colors placeholder-text-secondary text-text-primary"
                disabled={loading}
            />
        </div>
      </div>
       <input
          id="log-tags"
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Tags (e.g., react, typescript, css)"
          className="w-full p-3 bg-surface-light rounded-lg border border-border focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/50 transition-colors placeholder-text-secondary text-text-primary"
          disabled={loading}
        />
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="font-medium text-text-secondary">Mood:</span>
          <div className="flex gap-2">
            {MOODS.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMood(m)}
                className={`p-2 rounded-full text-2xl transition-all duration-200 ${mood === m ? 'bg-accent-primary/20 scale-110' : 'hover:bg-surface-light'} disabled:opacity-50`}
                aria-label={`Select mood: ${m}`}
                disabled={loading}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
            <button type="button" onClick={() => setIsPublic(true)} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${isPublic ? 'bg-accent-secondary/20 text-accent-secondary' : 'text-text-secondary hover:bg-surface-light'}`}>
                <GlobeIcon /> Public
            </button>
            <button type="button" onClick={() => setIsPublic(false)} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${!isPublic ? 'bg-accent-primary/20 text-accent-primary' : 'text-text-secondary hover:bg-surface-light'}`}>
                <LockIcon /> Private
            </button>
        </div>
      </div>
      <button type="submit" disabled={loading} className="w-full py-3 bg-gradient-to-r from-accent-primary to-accent-primary-dark text-white font-bold rounded-lg shadow-lg hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-accent-primary/50 focus:ring-offset-2 focus:ring-offset-surface disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center">
        {loading ? <div className="w-6 h-6 border-2 border-dashed rounded-full animate-spin border-white"></div> : 'Post Entry'}
      </button>
    </form>
  );
}
