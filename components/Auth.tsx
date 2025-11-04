
import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { LogoIcon } from './icons';

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: {
              role: 'developer',
            },
          },
        });
        if (error) {
          setError(error.message);
        } else {
          setMessage('Check your email for the confirmation link!');
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          setError(error.message);
        }
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
            <LogoIcon size="48" />
            <h1 className="text-4xl font-bold text-text-primary mt-4">Daily Skill Log</h1>
            <p className="text-text-secondary mt-2">The social network for developers who build in public.</p>
        </div>
        <div className="bg-surface p-8 rounded-xl border border-border">
          <h2 className="text-2xl font-bold text-text-primary text-center mb-6">{isSignUp ? 'Create Developer Account' : 'Developer Sign In'}</h2>
          
          {error && <p className="bg-red-900/50 text-red-300 p-3 rounded-lg mb-4 text-sm border border-red-500/50">{error}</p>}
          {message && <p className="bg-green-900/50 text-green-300 p-3 rounded-lg mb-4 text-sm border border-green-500/50">{message}</p>}

          <form onSubmit={handleAuthAction} className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <input
                id="email"
                className="w-full p-3 bg-surface-light rounded-lg border border-border focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/50 transition-colors placeholder-text-secondary text-text-primary"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@address.com"
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
              {loading ? <div className="w-6 h-6 border-2 border-dashed rounded-full animate-spin border-white"></div> : (isSignUp ? 'Sign Up' : 'Sign In')}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-surface text-text-secondary">Or</span>
            </div>
          </div>

          <p className="text-center text-sm text-text-secondary">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            <button onClick={() => { setIsSignUp(!isSignUp); setError(null); }} className="font-semibold text-accent-primary hover:underline ml-1">
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>
         <p className="mt-8 text-center text-sm text-text-secondary">
            Are you a recruiter?
            <a href="#auth/recruiter" className="font-semibold text-accent-secondary hover:underline ml-1">
              Recruiter Login &rarr;
            </a>
          </p>
      </div>
    </div>
  );
}
