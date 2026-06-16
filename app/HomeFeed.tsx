'use client';

import { useState } from 'react';
import Link from 'next/link';
import { TrendingUp, Zap } from 'lucide-react';
import type { Prediction, OverallStats, Bookmaker } from '@/lib/types';
import PredictionCard from '@/components/PredictionCard';
import StatTile from '@/components/StatTile';
import BookmakerStrip from '@/components/BookmakerStrip';

type Tab = 'today' | 'tomorrow' | 'week' | 'epl' | 'laliga' | 'ucl' | 'npfl';

const TABS: { id: Tab; label: string }[] = [
  { id: 'today', label: 'Today' },
  { id: 'tomorrow', label: 'Tomorrow' },
  { id: 'week', label: 'This Week' },
  { id: 'epl', label: 'Premier League' },
  { id: 'laliga', label: 'La Liga' },
  { id: 'ucl', label: 'Champions League' },
  { id: 'npfl', label: 'NPFL' },
];

function filterPredictions(predictions: Prediction[], tab: Tab): Prediction[] {
  const now = new Date();
  const todayStart = new Date(now); todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date(now); todayEnd.setHours(23, 59, 59, 999);
  const tomorrowStart = new Date(todayEnd.getTime() + 1);
  const tomorrowEnd = new Date(tomorrowStart); tomorrowEnd.setHours(23, 59, 59, 999);
  const weekEnd = new Date(now.getTime() + 7 * 86_400_000);

  if (tab === 'today') {
    return predictions.filter(p => {
      const d = new Date(p.fixture.kickoffAt);
      return d >= todayStart && d <= todayEnd || p.fixture.status === 'live' ||
        (p.fixture.status === 'finished' && d >= todayStart);
    });
  }
  if (tab === 'tomorrow') {
    return predictions.filter(p => {
      const d = new Date(p.fixture.kickoffAt);
      return d >= tomorrowStart && d <= tomorrowEnd;
    });
  }
  if (tab === 'week') return predictions.filter(p => new Date(p.fixture.kickoffAt) <= weekEnd);
  if (tab === 'epl') return predictions.filter(p => p.fixture.league === 'Premier League');
  if (tab === 'laliga') return predictions.filter(p => p.fixture.league === 'La Liga');
  if (tab === 'ucl') return predictions.filter(p => p.fixture.league === 'UEFA Champions League');
  if (tab === 'npfl') return predictions.filter(p => p.fixture.league === 'NPFL');
  return predictions;
}

interface Props {
  predictions: Prediction[];
  stats: OverallStats;
  bookmakers: Bookmaker[];
}

export default function HomeFeed({ predictions, stats, bookmakers }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('today');
  const filtered = filterPredictions(predictions, activeTab);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col gap-8">
      {/* Hero stats strip */}
      <section>
        <div
          className="rounded-2xl p-6 md:p-8 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #111317 0%, #0F1115 100%)', border: '1px solid rgba(170,255,0,0.15)' }}
        >
          {/* Background glow */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-5 blur-3xl pointer-events-none" style={{ background: '#AAFF00', transform: 'translate(30%, -30%)' }} />

          <div className="flex flex-col md:flex-row md:items-center gap-6 relative">
            {/* Headline */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4" style={{ color: '#AAFF00' }} />
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Verified Track Record</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-tight">
                <span className="tabular" style={{ color: '#AAFF00' }}>{stats.last30WinRate}%</span>
                <br />
                <span className="text-white/90">win rate</span>
                <span className="text-muted-foreground font-normal text-xl ml-2">last 30 days</span>
              </h1>
              <p className="text-sm text-muted-foreground mt-2">
                Based on {stats.settledPicks.toLocaleString()} settled picks — every result is verifiable
              </p>
              <div className="flex items-center gap-3 mt-4">
                <Link
                  href="/vip"
                  className="px-4 py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-90 active:scale-95 gold-glow"
                  style={{ background: '#F5A623', color: '#0A0B0D' }}
                >
                  ⚡ Go VIP
                </Link>
                <Link
                  href="/track-record"
                  className="px-4 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-white border border-white/10 hover:border-white/20 transition-all"
                >
                  View full record →
                </Link>
              </div>
            </div>

            {/* Stat tiles */}
            <div className="grid grid-cols-2 gap-3 md:w-72 shrink-0">
              <StatTile label="Win Rate" value={`${stats.winRate}%`} highlight delta={stats.last30WinRate - stats.winRate} deltaLabel="% vs avg" />
              <StatTile label="Total ROI" value={`+${stats.roiUnits}`} suffix="u" highlight />
              <StatTile label="Picks" value={stats.settledPicks} />
              <StatTile
                label="Hot Streak"
                value={stats.streak}
                suffix={` ${stats.streakType === 'won' ? 'W' : 'L'}`}
                highlight={stats.streakType === 'won'}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Bookmaker strip */}
      <section>
        <BookmakerStrip bookmakers={bookmakers} />
      </section>

      {/* VIP callout */}
      <section>
        <div
          className="rounded-xl p-4 flex items-center gap-4"
          style={{ background: 'rgba(245,166,35,0.06)', border: '1px solid rgba(245,166,35,0.2)' }}
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(245,166,35,0.15)' }}>
            <Zap className="w-5 h-5" style={{ color: '#F5A623' }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white">
              {filtered.filter(p => p.visibility !== 'free').length} VIP & premium picks locked in this feed
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">Unlock all VIP picks from ₦4,999/month</p>
          </div>
          <Link
            href="/vip"
            className="shrink-0 px-4 py-2 rounded-lg text-sm font-bold transition-all hover:opacity-90"
            style={{ background: '#F5A623', color: '#0A0B0D' }}
          >
            Go VIP
          </Link>
        </div>
      </section>

      {/* Filter tabs + prediction feed */}
      <section className="flex flex-col gap-4">
        {/* Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="shrink-0 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all"
              style={
                activeTab === tab.id
                  ? { background: '#AAFF00', color: '#0A0B0D', fontWeight: 700 }
                  : { background: 'rgba(255,255,255,0.05)', color: '#94A3B8' }
              }
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Count */}
        <p className="text-xs text-muted-foreground">
          {filtered.length} prediction{filtered.length !== 1 ? 's' : ''}
          {activeTab === 'today' ? ' today' : ''}
        </p>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg font-medium">No predictions yet</p>
            <p className="text-sm mt-1">Check back soon or try another filter</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => (
              <PredictionCard key={p.id} prediction={p} isUnlocked={p.visibility === 'free'} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
