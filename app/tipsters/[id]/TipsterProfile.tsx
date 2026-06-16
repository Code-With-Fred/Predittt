'use client';

import Link from 'next/link';
import { ArrowLeft, Cpu, User, Trophy, TrendingUp, BarChart3, Target } from 'lucide-react';
import type { Tipster, Prediction } from '@/lib/types';
import StatTile from '@/components/StatTile';
import PredictionCard from '@/components/PredictionCard';
import ConfidenceMeter from '@/components/ConfidenceMeter';

interface Props {
  tipster: Tipster;
  predictions: Prediction[];
}

export default function TipsterProfile({ tipster, predictions }: Props) {
  const settled = predictions.filter((p) => p.status === 'won' || p.status === 'lost');
  const won = predictions.filter((p) => p.status === 'won').length;
  const pending = predictions.filter((p) => p.status === 'pending');
  const avgOdds = settled.length
    ? (settled.reduce((s, p) => s + p.odds, 0) / settled.length).toFixed(2)
    : '—';
  const avgConfidence = predictions.length
    ? Math.round(predictions.reduce((s, p) => s + p.confidence, 0) / predictions.length)
    : 0;

  const marketBreakdown = predictions.reduce<Record<string, number>>((acc, p) => {
    acc[p.market] = (acc[p.market] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col gap-8">
      {/* Back */}
      <Link href="/tipsters" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors w-fit">
        <ArrowLeft className="w-4 h-4" />
        Back to leaderboard
      </Link>

      {/* Profile hero */}
      <div
        className="rounded-2xl p-6 relative overflow-hidden"
        style={{ background: '#111317', border: `1px solid ${tipster.isAi ? 'rgba(170,255,0,0.2)' : 'rgba(255,255,255,0.08)'}` }}
      >
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-5 blur-3xl pointer-events-none"
          style={{ background: tipster.isAi ? '#AAFF00' : '#94A3B8', transform: 'translate(30%,-30%)' }} />

        <div className="relative flex flex-col sm:flex-row sm:items-center gap-5">
          {/* Avatar */}
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center shrink-0 font-black text-2xl"
            style={{
              background: tipster.isAi ? 'rgba(170,255,0,0.12)' : 'rgba(148,163,184,0.12)',
              color: tipster.isAi ? '#AAFF00' : '#94A3B8',
            }}
          >
            {tipster.isAi ? <Cpu className="w-10 h-10" /> : <User className="w-10 h-10" />}
          </div>

          <div className="flex flex-col gap-2 flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-black">{tipster.displayName}</h1>
              <span
                className="px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider"
                style={
                  tipster.isAi
                    ? { background: 'rgba(170,255,0,0.12)', color: '#AAFF00', border: '1px solid rgba(170,255,0,0.2)' }
                    : { background: 'rgba(148,163,184,0.12)', color: '#94A3B8', border: '1px solid rgba(148,163,184,0.2)' }
                }
              >
                {tipster.isAi ? '🤖 AI Model' : '👤 Expert'}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {tipster.isAi
                ? 'Proprietary machine learning model trained on historical match data, xG metrics, and market signals.'
                : 'Independent football analyst with a verified track record across multiple leagues.'}
            </p>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatTile label="Win Rate" value={`${tipster.winRate}%`} highlight />
        <StatTile label="ROI" value={`+${tipster.roiUnits}`} suffix="u" highlight />
        <StatTile label="Settled Picks" value={tipster.settled} />
        <StatTile label="Avg Odds" value={avgOdds} suffix="x" />
      </div>

      {/* Avg confidence + market breakdown */}
      <div className="grid md:grid-cols-2 gap-5">
        {/* Confidence */}
        <div className="rounded-2xl p-5 flex flex-col gap-4" style={{ background: '#111317', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-muted-foreground" />
            <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Avg Confidence</h2>
          </div>
          <ConfidenceMeter value={avgConfidence} size="lg" />
        </div>

        {/* Market breakdown */}
        <div className="rounded-2xl p-5 flex flex-col gap-4" style={{ background: '#111317', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-muted-foreground" />
            <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Market Breakdown</h2>
          </div>
          <div className="flex flex-col gap-2.5">
            {Object.entries(marketBreakdown).map(([market, count]) => {
              const pct = Math.round((count / predictions.length) * 100);
              return (
                <div key={market} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{market}</span>
                    <span className="tabular font-bold text-white">{pct}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/8 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, background: '#AAFF00' }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Win / Loss visual */}
      <div className="rounded-2xl p-5 flex flex-col gap-4" style={{ background: '#111317', border: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-muted-foreground" />
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Record</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center gap-1">
            <span className="tabular text-2xl font-black" style={{ color: '#AAFF00' }}>{won}</span>
            <span className="text-xs text-muted-foreground">Won</span>
          </div>
          <div className="flex-1 h-4 rounded-full overflow-hidden bg-white/5 flex">
            {settled.length > 0 && (
              <>
                <div className="h-full rounded-l-full transition-all duration-500" style={{ width: `${(won / settled.length) * 100}%`, background: '#AAFF00' }} />
                <div className="h-full rounded-r-full flex-1" style={{ background: '#EF4444' }} />
              </>
            )}
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="tabular text-2xl font-black text-red-400">{settled.length - won}</span>
            <span className="text-xs text-muted-foreground">Lost</span>
          </div>
        </div>
        {pending.length > 0 && (
          <p className="text-xs text-muted-foreground">{pending.length} pick{pending.length !== 1 ? 's' : ''} pending settlement</p>
        )}
      </div>

      {/* Recent predictions */}
      {predictions.length > 0 && (
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" style={{ color: '#AAFF00' }} />
              <h2 className="font-bold">Picks by {tipster.displayName}</h2>
            </div>
            <span className="text-xs text-muted-foreground tabular">{predictions.length} total</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {predictions.map((p) => (
              <PredictionCard key={p.id} prediction={p} isUnlocked={p.visibility === 'free'} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
