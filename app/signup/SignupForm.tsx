'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Check } from 'lucide-react';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

const PERKS = [
  'Free picks every day',
  'Full track record access',
  'AI & expert tipster profiles',
];

export default function SignupForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password) return;
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }

    setLoading(true);
    setError('');
    const supabase = createClient();

    const { error: err } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name.trim() },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      },
    });

    setLoading(false);
    if (err) { setError(err.message); return; }
    setDone(true);
  }

  async function handleGoogle() {
    setGoogleLoading(true);
    setError('');
    const supabase = createClient();
    const { error: err } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback?next=/dashboard` },
    });
    if (err) { setError(err.message); setGoogleLoading(false); }
  }

  if (done) {
    return (
      <div className="min-h-[calc(100vh-56px)] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm flex flex-col items-center gap-6 text-center">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl" style={{ background: '#AAFF00', color: '#0A0B0D' }}>✓</div>
          <div>
            <h2 className="text-xl font-black">Check your inbox</h2>
            <p className="text-sm text-muted-foreground mt-2">
              We sent a confirmation link to <strong className="text-white">{email}</strong>.<br />
              Click it to activate your account.
            </p>
          </div>
          <Link href="/login" className="text-sm font-bold" style={{ color: '#AAFF00' }}>Back to sign in →</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm flex flex-col gap-6">
        {/* Logo */}
        <div className="text-center flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl" style={{ background: '#AAFF00', color: '#0A0B0D' }}>P</div>
          <div>
            <h1 className="text-xl font-black">Create your account</h1>
            <p className="text-sm text-muted-foreground mt-1">Free forever — upgrade to VIP any time</p>
          </div>
        </div>

        {/* Perks */}
        <div className="flex flex-col gap-2">
          {PERKS.map((p) => (
            <div key={p} className="flex items-center gap-2.5 text-sm text-muted-foreground">
              <Check className="w-4 h-4 shrink-0" style={{ color: '#AAFF00' }} />
              {p}
            </div>
          ))}
        </div>

        {/* Form card */}
        <form
          onSubmit={handleSignup}
          className="rounded-2xl p-6 flex flex-col gap-5"
          style={{ background: '#111317', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          {/* Google button */}
          <button
            type="button"
            onClick={handleGoogle}
            disabled={googleLoading || loading}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl text-sm font-bold transition-all hover:bg-white/10 border border-white/10 hover:border-white/20 disabled:opacity-50"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            {googleLoading ? 'Redirecting…' : 'Continue with Google'}
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/8" />
            <span className="text-xs text-muted-foreground">or</span>
            <div className="flex-1 h-px bg-white/8" />
          </div>

          {error && (
            <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>
          )}

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Display name</label>
              <input
                id="name" type="text" placeholder="Your name" required
                value={name} onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl text-sm text-white placeholder:text-muted-foreground/60 border border-white/10 focus:outline-none focus:ring-1 focus:ring-[#AAFF00]/50 focus:border-[#AAFF00]/40 transition-all"
                style={{ background: 'rgba(255,255,255,0.05)' }}
                autoComplete="name"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</label>
              <input
                id="email" type="email" placeholder="you@example.com" required
                value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl text-sm text-white placeholder:text-muted-foreground/60 border border-white/10 focus:outline-none focus:ring-1 focus:ring-[#AAFF00]/50 focus:border-[#AAFF00]/40 transition-all"
                style={{ background: 'rgba(255,255,255,0.05)' }}
                autoComplete="email"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Password</label>
              <div className="relative">
                <input
                  id="password" type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 8 characters" required minLength={8}
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 pr-10 rounded-xl text-sm text-white placeholder:text-muted-foreground/60 border border-white/10 focus:outline-none focus:ring-1 focus:ring-[#AAFF00]/50 focus:border-[#AAFF00]/40 transition-all"
                  style={{ background: 'rgba(255,255,255,0.05)' }}
                  autoComplete="new-password"
                />
                <button
                  type="button" onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit" disabled={loading || googleLoading}
            className="w-full py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
            style={{ background: '#AAFF00', color: '#0A0B0D' }}
          >
            {loading ? 'Creating account…' : 'Create free account'}
          </button>

          <p className="text-[11px] text-muted-foreground text-center leading-relaxed">
            By signing up you agree to our{' '}
            <Link href="/terms" className="underline hover:text-white transition-colors">Terms</Link>
            {' '}and{' '}
            <Link href="/privacy" className="underline hover:text-white transition-colors">Privacy Policy</Link>.
            Must be 18+ to use this service.
          </p>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="font-bold hover:underline" style={{ color: '#AAFF00' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
