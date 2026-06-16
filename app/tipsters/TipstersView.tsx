'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Cpu, User, ArrowUpDown, TrendingUp, Trophy, ChevronRight } from 'lucide-react';
import type { Tipster } from '@/lib/types';

type SortKey = 'winRate' | 'roiUnits' | 'settled';

interface Props {
  tipsters: Tipster[];
}

export default function TipstersView({ tipsters }: Props) {
  const [sort, setSort] = useState<{ key: SortKey; dir: 'asc' | 'desc' }>({ key: 'winRate', dir: 'desc' });
  const [aiOnly, setAiOnly] = useState(false);

  const sorted = [...tipsters]
    .filter((t) => !aiOnly || t.isAi)
    .sort((a, b) => {
      const diff = a[sort.key] - b[sort.key];
      return sort.dir === 'asc' ? diff : -diff;
    });

  function toggleSort(key: SortKey) {
    setSort((s) => s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'desc' });
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" style={{ color: '#AAFF00' }} />
          <h1 className="text-2xl font-black tracking-tight">Tipster Leaderboard</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Ranked by verified win rate. AI models and human experts, side by side.
        </p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setAiOnly(false)}
          className="px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all"
          style={!aiOnly ? { background: '#AAFF00', color: '#0A0B0D', fontWeight: 700 } : { background: 'rgba(255,255,255,0.05)', color: '#94A3B8' }}
        >
          All
        </button>
        <button
          onClick={() => setAiOnly(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all"
          style={aiOnly ? { background: '#AAFF00', color: '#0A0B0D', fontWeight: 700 } : { background: 'rgba(255,255,255,0.05)', color: '#94A3B8' }}
        >
          <Cpu className="w-3.5 h-3.5" />
          AI Only
        </button>
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden border border-white/8" style={{ background: '#111317' }}>
        {/* Header */}
        <div
          className="hidden md:grid border-b border-white/8 text-xs font-bold text-muted-foreground uppercase tracking-wider"
          style={{ gridTemplateColumns: '2.5rem 2fr 1fr 1fr 1fr 2rem' }}
        >
          <div className="p-4">#</div>
          <div className="p-4">Tipster</div>
          <button className="flex items-center gap-1 p-4 hover:text-white transition-colors" onClick={() => toggleSort('winRate')}>
            Win Rate <ArrowUpDown className="w-3 h-3" />
          </button>
          <button className="flex items-center gap-1 p-4 hover:text-white transition-colors" onClick={() => toggleSort('roiUnits')}>
            ROI (units) <ArrowUpDown className="w-3 h-3" />
          </button>
          <button className="flex items-center gap-1 p-4 hover:text-white transition-colors" onClick={() => toggleSort('settled')}>
            Settled <ArrowUpDown className="w-3 h-3" />
          </button>
          <div className="p-4" />
        </div>

        {/* Rows */}
        {sorted.map((tipster, i) => {
          const rank = i + 1;
          const isTop = rank === 1;
          return (
            <div
              key={tipster.id}
              className="border-b border-white/5 last:border-0 transition-colors hover:bg-white/3"
              style={i % 2 === 0 ? {} : { background: 'rgba(255,255,255,0.01)' }}
            >
              {/* Mobile */}
              <Link href={`/tipsters/${tipster.id}`} className="md:hidden p-4 flex items-center gap-4">
                <span
                  className="tabular text-sm font-black w-6 text-center shrink-0"
                  style={{ color: rank === 1 ? '#F5A623' : rank === 2 ? '#94A3B8' : rank === 3 ? '#B87333' : '#475569' }}
                >
                  {rank}
                </span>
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold text-sm"
                  style={{
                    background: tipster.isAi ? 'rgba(170,255,0,0.12)' : 'rgba(148,163,184,0.12)',
                    color: tipster.isAi ? '#AAFF00' : '#94A3B8',
                  }}
                >
                  {tipster.isAi ? <Cpu className="w-5 h-5" /> : tipster.displayName.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm truncate">{tipster.displayName}</span>
                    {tipster.isAi && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold" style={{ background: 'rgba(170,255,0,0.12)', color: '#AAFF00' }}>AI</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                    <span className="tabular font-bold" style={{ color: '#AAFF00' }}>{tipster.winRate}%</span>
                    <span>·</span>
                    <span className="tabular">+{tipster.roiUnits}u</span>
                    <span>·</span>
                    <span className="tabular">{tipster.settled} picks</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
              </Link>

              {/* Desktop */}
              <div
                className="hidden md:grid text-sm items-center"
                style={{ gridTemplateColumns: '2.5rem 2fr 1fr 1fr 1fr 2rem' }}
              >
                <div className="p-4">
                  <span
                    className="tabular font-black"
                    style={{ color: rank === 1 ? '#F5A623' : rank === 2 ? '#94A3B8' : rank === 3 ? '#B87333' : '#475569' }}
                  >
                    {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rank}
                  </span>
                </div>
                <div className="p-4 flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 font-bold"
                    style={{
                      background: tipster.isAi ? 'rgba(170,255,0,0.12)' : 'rgba(148,163,184,0.12)',
                      color: tipster.isAi ? '#AAFF00' : '#94A3B8',
                    }}
                  >
                    {tipster.isAi ? <Cpu className="w-4 h-4" /> : tipster.displayName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{tipster.displayName}</span>
                      {tipster.isAi ? (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold" style={{ background: 'rgba(170,255,0,0.12)', color: '#AAFF00' }}>AI</span>
                      ) : (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold" style={{ background: 'rgba(148,163,184,0.12)', color: '#94A3B8' }}>Expert</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <span
                    className="tabular font-black text-base"
                    style={{ color: isTop ? '#F5A623' : '#AAFF00' }}
                  >
                    {tipster.winRate}%
                  </span>
                </div>
                <div className="p-4">
                  <span className="tabular font-bold" style={{ color: '#AAFF00' }}>+{tipster.roiUnits}u</span>
                </div>
                <div className="p-4">
                  <span className="tabular text-muted-foreground">{tipster.settled}</span>
                </div>
                <div className="p-4">
                  <Link href={`/tipsters/${tipster.id}`} className="text-muted-foreground hover:text-white transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Info strip */}
      <div
        className="rounded-xl p-4 flex items-start gap-3"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <Trophy className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          Rankings are based on all settled picks. Win rate and ROI are calculated from real results — no adjustments or exclusions.
          AI models run continuously and are updated weekly. Human experts are independently verified.
        </p>
      </div>
    </div>
  );
}
