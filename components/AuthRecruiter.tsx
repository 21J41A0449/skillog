
import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { BriefcaseIcon } from './icons';

export default function AuthRecruiter() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
      } else if (data?.user && data.user.user_metadata?.role !== 'recruiter') {
        setError('Recruiter access required.');
        await supabase.auth.signOut();
      }
    } catch (authError) {
      if (authError instanceof Error) {
        setError(authError.message);
      } else {
        setError('Authentication failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm mx-auto">
        <div className="text-center mb-8 flex flex-col items-center">
            <BriefcaseIcon size="48" className="text-accent-primary" />
            <h1 className="text-4xl font-bold text-text-primary mt-4">Recruiter Portal</h1>
            <p className="text-text-secondary mt-2">Access the highest-signal talent pool in tech.</p>
        </div>
        <div className="bg-surface p-8 rounded-xl border border-border">
          <h2 className="text-2xl font-bold text-text-primary text-center mb-6">Sign In</h2>
          
          {error && <p className="bg-red-900/50 text-red-300 p-3 rounded-lg mb-4 text-sm border border-red-500/50">{error}</p>}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">Company Email</label>
              <input
                id="email"
                className="w-full p-3 bg-surface-light rounded-lg border border-border focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/50 transition-colors placeholder-text-secondary text-text-primary"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="recruiter@company.com"
                required
              />
            </div>
            <div>
              <label htmlFor="password"className="sr-only">Password</label>
              <input
                id="password"
                className="w-full p-3 bg-surface-light rounded-lg border border-border focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/50 transition-colors placeholder-text-secondary text-text-primary"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
              />
            </div>
            <button type="submit" disabled={loading} className="w-full py-3 bg-gradient-to-r from-accent-primary to-accent-primary-dark text-white font-bold rounded-lg shadow-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
              {loading ? <div className="w-6 h-6 border-2 border-dashed rounded-full animate-spin border-white"></div> : 'Sign In'}
            </button>
          </form>
        </div>
         <p className="mt-8 text-center text-sm text-text-secondary">
            Don't have an account?
            <a href="mailto:sales@skilllog.com" className="font-semibold text-accent-secondary hover:underline ml-1">
              Contact Sales &rarr;
            </a>
          </p>
      </div>
    </div>
  );
}
