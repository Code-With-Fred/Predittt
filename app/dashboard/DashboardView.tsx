'use client';

import Link from 'next/link';
import { Crown, Lock, Bookmark, TrendingUp, Cpu } from 'lucide-react';
import type { Prediction } from '@/lib/types';
import type { MockUser } from '@/lib/api';
import PredictionCard from '@/components/PredictionCard';
import { useBookmarks } from '@/lib/BookmarkContext';

interface Props {
  user: MockUser;
  predictions: Prediction[];
}

export default function DashboardView({ user, predictions }: Props) {
  const { bookmarkedIds, isBookmarked } = useBookmarks();
  const unlockedPredictions = predictions.filter((p) => user.unlockedPremiumIds.includes(p.id));
  // Merge server-seeded saved fixtures with client bookmarks
  const savedFixtures = predictions.filter(
    (p) => user.savedFixtureIds.includes(p.fixture.id) || isBookmarked(p.id)
  );
  const recentResults = predictions.filter((p) => p.status === 'won' || p.status === 'lost').slice(0, 4);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col gap-8">
      {/* Welcome + VIP card */}
      <section
        className="rounded-2xl p-5 md:p-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #111317 0%, #0F1115 100%)', border: '1px solid rgba(245,166,35,0.25)' }}
      >
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-5 blur-3xl pointer-events-none" style={{ background: '#F5A623', transform: 'translate(30%, -30%)' }} />
        <div className="relative flex flex-col md:flex-row md:items-center gap-4">
          {/* Avatar */}
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center font-black text-xl shrink-0"
            style={{ background: 'rgba(170,255,0,0.12)', color: '#AAFF00' }}
          >
            {user.displayName.slice(0, 1)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground mb-0.5">Welcome back</p>
            <h1 className="text-xl font-black">{user.displayName}</h1>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-xl self-start md:self-center shrink-0"
            style={{ background: 'rgba(245,166,35,0.15)', border: '1px solid rgba(245,166,35,0.3)' }}
          >
            <Crown className="w-4 h-4" style={{ color: '#F5A623' }} />
            <span className="font-black text-sm" style={{ color: '#F5A623' }}>VIP Member</span>
          </div>
        </div>

        {/* VIP stats */}
        <div className="mt-5 grid grid-cols-3 gap-3">
          {[
            { label: 'Unlocked Tips', value: user.unlockedPremiumIds.length },
            { label: 'Saved Picks', value: bookmarkedIds.size + user.savedFixtureIds.length },
            { label: 'Plan', value: 'VIP' },
          ].map(({ label, value }) => (
            <div key={label} className="flex flex-col gap-1 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <span className="text-xs text-muted-foreground">{label}</span>
              <span className="tabular font-black text-lg" style={{ color: '#F5A623' }}>{value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Unlocked Premium Tips */}
      {unlockedPredictions.length > 0 && (
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4" style={{ color: '#AAFF00' }} />
              <h2 className="font-bold">Unlocked Premium Tips</h2>
            </div>
            <span className="text-xs text-muted-foreground tabular">{unlockedPredictions.length} tip{unlockedPredictions.length !== 1 ? 's' : ''}</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {unlockedPredictions.map((p) => (
              <PredictionCard key={p.id} prediction={p} isUnlocked={true} />
            ))}
          </div>
        </section>
      )}

      {/* Saved fixtures */}
      {savedFixtures.length > 0 && (
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bookmark className="w-4 h-4" style={{ color: '#94A3B8' }} />
              <h2 className="font-bold">Saved Fixtures</h2>
            </div>
            <span className="text-xs text-muted-foreground tabular">{savedFixtures.length}</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {savedFixtures.map((p) => (
              <PredictionCard key={p.id} prediction={p} isUnlocked={p.visibility === 'free' || user.unlockedPremiumIds.includes(p.id)} />
            ))}
          </div>
        </section>
      )}

      {/* Recent results */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" style={{ color: '#AAFF00' }} />
            <h2 className="font-bold">Recent Results</h2>
          </div>
          <Link href="/track-record" className="text-xs text-muted-foreground hover:text-white transition-colors">
            Full record →
          </Link>
        </div>
        {recentResults.length === 0 ? (
          <p className="text-sm text-muted-foreground">No settled picks yet today.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {recentResults.map((p) => (
              <PredictionCard key={p.id} prediction={p} isUnlocked={true} />
            ))}
          </div>
        )}
      </section>

      {/* Account management */}
      <section
        className="rounded-2xl p-5 flex flex-col gap-3"
        style={{ background: '#111317', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <h2 className="font-bold">Account</h2>
        <div className="flex flex-col gap-2">
          {[
            { label: 'Manage subscription', icon: Crown, href: '/vip' },
            { label: 'View tipster leaderboard', icon: Cpu, href: '/tipsters' },
            { label: 'Full track record', icon: TrendingUp, href: '/track-record' },
          ].map(({ label, icon: Icon, href }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-white hover:bg-white/5 transition-all"
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </div>
        <div className="pt-2 border-t border-white/8">
          <button className="w-full px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all">
            Sign out
          </button>
        </div>
      </section>
    </div>
  );
}
