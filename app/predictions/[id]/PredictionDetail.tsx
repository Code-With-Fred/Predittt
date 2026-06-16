'use client';

import Link from 'next/link';
import { ArrowLeft, Lock, Cpu, User, Zap, ExternalLink, Trophy, X, Clock } from 'lucide-react';
import type { Prediction, Bookmaker } from '@/lib/types';
import FixtureHeader from '@/components/FixtureHeader';
import ConfidenceMeter from '@/components/ConfidenceMeter';
import PredictionCard from '@/components/PredictionCard';

const statusConfig = {
  won: { label: 'Won', icon: Trophy, color: '#AAFF00', bg: 'rgba(170,255,0,0.12)' },
  lost: { label: 'Lost', icon: X, color: '#EF4444', bg: 'rgba(239,68,68,0.12)' },
  pending: { label: 'Pending', icon: Clock, color: '#94A3B8', bg: 'rgba(148,163,184,0.12)' },
  void: { label: 'Void', icon: X, color: '#6B7280', bg: 'rgba(107,114,128,0.12)' },
};

const sourceConfig = {
  ai: { label: 'AI Model', icon: Cpu, color: '#AAFF00' },
  manual: { label: 'Expert Pick', icon: User, color: '#94A3B8' },
  hybrid: { label: 'AI + Expert', icon: Zap, color: '#F5A623' },
};

interface Props {
  prediction: Prediction;
  related: Prediction[];
  bookmakers: Bookmaker[];
}

export default function PredictionDetail({ prediction, related, bookmakers }: Props) {
  const { fixture, tipster, source, market, pick, odds, confidence, reasoning, visibility, price, status } = prediction;
  const isLocked = visibility !== 'free';
  const stat = statusConfig[status];
  const src = sourceConfig[source];
  const StatIcon = stat.icon;
  const SrcIcon = src.icon;
  const primaryBookmaker = bookmakers[0];

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-6">
      {/* Back */}
      <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors w-fit">
        <ArrowLeft className="w-4 h-4" />
        Back to picks
      </Link>

      {/* Fixture header */}
      <div
        className="rounded-2xl p-6"
        style={{ background: '#111317', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <FixtureHeader fixture={fixture} />
      </div>

      {/* Pick card */}
      <div
        className="rounded-2xl p-5 flex flex-col gap-5"
        style={{ background: '#111317', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        {/* Badges row */}
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
            style={{ background: `${src.color}18`, color: src.color }}
          >
            <SrcIcon className="w-3 h-3" />
            {src.label}
          </span>
          <span
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
            style={{ background: stat.bg, color: stat.color }}
          >
            <StatIcon className="w-3 h-3" />
            {stat.label}
          </span>
          {visibility === 'vip' && (
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wide" style={{ background: '#F5A623', color: '#0A0B0D' }}>
              VIP
            </span>
          )}
          {visibility === 'premium' && (
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wide lime-glow" style={{ background: '#AAFF00', color: '#0A0B0D' }}>
              Premium
            </span>
          )}
        </div>

        {/* Market + Pick + Odds */}
        <div className="grid grid-cols-3 gap-3">
          <div className="flex flex-col gap-1 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Market</span>
            <span className="font-bold text-sm">{market}</span>
          </div>
          <div className="flex flex-col gap-1 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Pick</span>
            {isLocked ? (
              <span className="prediction-blur font-bold text-sm">████████</span>
            ) : (
              <span className="font-bold text-sm text-white">{pick}</span>
            )}
          </div>
          <div className="flex flex-col gap-1 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Odds</span>
            {isLocked ? (
              <span className="prediction-blur tabular font-black text-base">█.██</span>
            ) : (
              <span
                className="tabular font-black text-base"
                style={{ color: status === 'won' ? '#AAFF00' : status === 'lost' ? '#EF4444' : 'white' }}
              >
                {odds.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        {/* Confidence */}
        {!isLocked && <ConfidenceMeter value={confidence} size="lg" />}

        {/* Reasoning */}
        <div>
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Analysis</h3>
          {isLocked ? (
            <div className="relative rounded-xl overflow-hidden">
              <p className="text-sm leading-relaxed text-white/60 prediction-blur select-none" aria-hidden="true">
                This analysis covers key statistical indicators, recent form data, head-to-head records, and market movement signals that informed this prediction. Full methodology is available to subscribers.
              </p>
              <div
                className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-xl"
                style={{ background: 'rgba(10,11,13,0.85)' }}
              >
                <Lock className="w-6 h-6" style={{ color: visibility === 'vip' ? '#F5A623' : '#AAFF00' }} />
                <p className="text-sm font-bold text-center">
                  {visibility === 'vip' ? 'Full analysis is VIP-only' : 'Purchase to read full analysis'}
                </p>
                <Link
                  href={visibility === 'vip' ? '/vip' : '#'}
                  className="px-4 py-2 rounded-lg text-sm font-bold transition-all hover:opacity-90"
                  style={
                    visibility === 'vip'
                      ? { background: '#F5A623', color: '#0A0B0D' }
                      : { background: '#AAFF00', color: '#0A0B0D' }
                  }
                >
                  {visibility === 'vip' ? 'Unlock with VIP' : `Unlock for ₦${price?.toLocaleString()}`}
                </Link>
              </div>
            </div>
          ) : (
            <p className="text-sm leading-relaxed text-white/80">{reasoning}</p>
          )}
        </div>

        {/* Tipster */}
        <div
          className="flex items-center gap-3 pt-4 border-t"
          style={{ borderColor: 'rgba(255,255,255,0.06)' }}
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center font-bold"
            style={{ background: tipster.isAi ? 'rgba(170,255,0,0.15)' : 'rgba(148,163,184,0.15)', color: tipster.isAi ? '#AAFF00' : '#94A3B8' }}
          >
            {tipster.isAi ? <Cpu className="w-5 h-5" /> : tipster.displayName.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm">{tipster.displayName}</p>
            <p className="text-xs text-muted-foreground">
              {tipster.settled} picks · <span className="tabular" style={{ color: '#AAFF00' }}>{tipster.winRate}% win rate</span> · +{tipster.roiUnits}u ROI
            </p>
          </div>
          <Link href={`/tipsters/${tipster.id}`} className="text-xs text-muted-foreground hover:text-white transition-colors">
            Profile →
          </Link>
        </div>
      </div>

      {/* Bookmaker CTA */}
      {!isLocked && primaryBookmaker && (
        <div
          className="rounded-2xl p-5 flex flex-col gap-4"
          style={{ background: '#111317', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Place this bet</h3>
          <div className="flex flex-wrap gap-3">
            {bookmakers.slice(0, 3).map((bm) => (
              <a
                key={bm.id}
                href={bm.affiliateUrl}
                target="_blank"
                rel="noopener sponsored"
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold flex-1 min-w-35 justify-center transition-all hover:scale-105"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)', color: 'white' }}
              >
                {bm.name}
                <ExternalLink className="w-3.5 h-3.5 opacity-60" />
              </a>
            ))}
          </div>
          <p className="text-[10px] text-muted-foreground">
            Sponsored links — Predicta.ng may earn a commission. Bet responsibly. 18+
          </p>
        </div>
      )}

      {/* Related picks */}
      {related.length > 0 && (
        <section className="flex flex-col gap-4">
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Related Picks</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {related.map((p) => (
              <PredictionCard key={p.id} prediction={p} isUnlocked={p.visibility === 'free'} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
